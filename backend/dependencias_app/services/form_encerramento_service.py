import os
import threading
import uuid
import base64
import locale
import requests
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.db import models, transaction
from rest_framework import serializers
from dependencias_app.models.usuario import Usuario
from dependencias_app.services.notificacao_service import NotificacaoService
from dependencias_app.services.acesso_service import AcessoService
from dependencias_app.services.file_service import FileService
from dependencias_session.services.token_service import TokenService
from ..utils.validar_modalidade import validar_modalidade
from ..utils.manage_files import upload_to_drive, get_from_drive, change_file
from django.conf import settings
from types import SimpleNamespace

DRIVE_FOLDER = settings.DRIVE_FORM_ENCERRAMENTO_FOLDER
cookies = {"system": settings.API_KEY}
base_url = settings.BASE_SYSTEM_URL
logo_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_pdf", "logo-ifrs-colorido.png")
template_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_email", "formEncerramento.html")
try:
    locale.setlocale(locale.LC_TIME, "pt_BR.UTF-8")
except locale.Error:
    locale.setlocale(locale.LC_TIME, "")

class FormEncerramentoService:
    @staticmethod
    def obter_atividades_por_ped(professor, modalidade, ped_id):
        ped_model_class, _ = validar_modalidade(modalidade, "PED")

        if modalidade == "Integrado":
            ped_queryset = ped_model_class.objects.annotate(
                professor_ped=models.F("professores_emi__professor")
            ).filter(
                id=uuid.UUID(ped_id),
                professores_emi__professor__id=uuid.UUID(professor.get("user_id")),
                professores_emi__responsavel_atual=True
            )
            atividades_attr = "atividades_emi"

        else:
            ped_queryset = ped_model_class.objects.annotate(
                professor_ped=models.F("professores_proeja__professor")
            ).filter(
                id=uuid.UUID(ped_id),
                professores_proeja__professor=uuid.UUID(professor.get("user_id")),
                professores_proeja__responsavel_atual=True
            )
            atividades_attr = "atividades_proeja"

        ped = ped_queryset.first()

        if ped is None:
            raise serializers.ValidationError("Progressão não encontrada para o usuário solicitante")

        atividades = getattr(ped, atividades_attr).all()

        return ped, atividades

    @staticmethod
    @transaction.atomic
    def criar(request, modalidade, ped_id):
        _, serializer_class = validar_modalidade(modalidade, "FormEncerramento")

        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        context = serializer.validated_data.copy()

        serializer.validated_data.pop("atividades", None)
        serializer.validated_data.pop("nota", None)
        form_encerramento_instance = serializer.Meta.model(**serializer.validated_data)

        professor, ped = AcessoService.validar_acesso(request, modalidade, ped_id)

        if str(ped.professor_ped) != TokenService.decode_token(request.COOKIES.get(settings.AUTH_COOKIE_NAME))["user_id"]:
            raise serializers.ValidationError("Acesso não autorizado")

        if ped.status != "Em Andamento":
            raise serializers.ValidationError("Esta progressão não está em andamento")

        context["professor"] = requests.get(
            f"{base_url}/api/users/get/{str(professor.get("user_id"))}/",
            params={"fields": "username"},
            cookies=cookies
        ).json().get("username")
        context["data"] = datetime.now().strftime("%d de %B de %Y")
        context["logo"] = f"file:///{logo_path.replace(os.sep, '/')}"

        file = FileService.gerar_pdf("templates/form_encerramento.html", context)

        file.seek(0)
        pdf_base64 = base64.b64encode(file.read()).decode("utf-8")

        file.seek(0)
        form_encerramento_instance.drive_id = upload_to_drive(
            file,
            f"form_encerramento_{str(ped.id)}",
            professor.get("group"),
            DRIVE_FOLDER
        )

        form_encerramento_instance.save()

        ped.status = "Lançada"
        ped.nota_final = float(context.get("nota"))
        ped.situacao = "Aprovado" if float(context.get("nota")) >= 7.0 else "Reprovado"
        ped.save()

        destinatarios = Usuario.objects.filter(group__name='gestao_escolar')

        transaction.on_commit(
            lambda: threading.Thread(
                target=NotificacaoService.criar_notificacao,
                args=([{'id': str(destinatario.id), 'grupo': 'Gestão Escolar'} for destinatario in destinatarios], template_path, "Formulário de encerramento preenchido", ped),
                daemon=True
            ).start()
        )

        return pdf_base64

    @staticmethod
    def detalhes(request, modalidade, form_encerramento_id):
        model_class, serializer_class = validar_modalidade(modalidade, "FormEncerramento")
        _, avaliacao_serializer_class = validar_modalidade(modalidade, "Avaliacao")

        form_encerramento = get_object_or_404(model_class, pk=uuid.UUID(form_encerramento_id))

        req = SimpleNamespace(GET={'retorno': 'id, atividade.id, atividade.titulo, data_entrega, data_criacao, nota, status, ped.id'})

        serializer = serializer_class(form_encerramento, context={"request": request})

        payload_usuario, ped = AcessoService.validar_acesso(request, modalidade, str(form_encerramento.ped.id))
        arquivo = get_from_drive(form_encerramento.drive_id, payload_usuario.get("group"))

        if payload_usuario.get("group") == 'professor':
            _, atividades = FormEncerramentoService.obter_atividades_por_ped(payload_usuario, modalidade, str(form_encerramento.ped.id))

            serializer_avaliacoes = avaliacao_serializer_class(atividades, many=True, context={'request': req})

            return {**serializer.data, "nota": ped.nota_final, "atividades": serializer_avaliacoes.data}, arquivo["data"]
        else:
            return {}, arquivo['data']

    @staticmethod
    @transaction.atomic
    def editar(request, modalidade, form_encerramento_id):
        model_class, serializer_class = validar_modalidade(modalidade, "FormEncerramento")

        instance = get_object_or_404(model_class, pk=uuid.UUID(form_encerramento_id))

        serializer = serializer_class(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        context = serializer.validated_data.copy()

        serializer.validated_data.pop("atividades", None)
        serializer.validated_data.pop("nota", None)
        
        form_encerramento_instance = instance

        professor, ped = AcessoService.validar_acesso(request, modalidade, str(instance.ped.id))

        if str(ped.professor_ped) != TokenService.decode_token(request.COOKIES.get(settings.AUTH_COOKIE_NAME))["user_id"]:
            raise serializers.ValidationError("Acesso não autorizado")

        if ped.status != "Lançada":
            raise serializers.ValidationError("Esta progressão ainda não foi lançada.")

        context["professor"] = requests.get(
            f"{base_url}/api/users/get/{str(professor.get("user_id"))}/",
            params={"fields": "username"},
            cookies=cookies
        ).json().get("username")

        context["data"] = datetime.now().strftime("%d de %B de %Y")
        context["logo"] = f"file:///{logo_path.replace(os.sep, '/')}"
        file = FileService.gerar_pdf("templates/form_encerramento.html", context)

        file.seek(0)
        pdf_base64 = base64.b64encode(file.read()).decode("utf-8")

        file.seek(0)
        form_encerramento_instance.drive_id = change_file(
            file,
            f"form_encerramento_{str(ped.id)}",
            instance.drive_id,
            DRIVE_FOLDER,
            professor.get("group"),
        )

        form_encerramento_instance.save()

        ped.nota_final = float(context.get("nota"))
        ped.situacao = "Aprovado" if float(context.get("nota")) >= 7 else "Reprovado"
        ped.save()

        return pdf_base64
