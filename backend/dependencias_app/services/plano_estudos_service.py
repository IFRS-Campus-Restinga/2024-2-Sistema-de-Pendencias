import os
import uuid
import base64
from datetime import datetime
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from ..utils.validar_modalidade import validar_modalidade
from ..utils.flatten_obj import flatten_named_fields
from ..utils.manage_files import upload_to_drive, get_from_drive, change_file
from django.conf import settings
from django.db.models import OuterRef, Subquery, UUIDField
from django.forms.models import model_to_dict
from ..models.ped_integrado import PEDIntegrado
from ..models.ped_proeja import PEDProeja
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProeja
from .async_request_service import AsyncRequestService
from .file_service import FileService
from dependencias_session.services.token_service import TokenService

DRIVE_FOLDER = settings.DRIVE_PLANO_ESTUDOS_FOLDER
cookies = {"system": settings.API_KEY}
base_url = settings.BASE_SYSTEM_URL
logo_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_pdf", "logo-ifrs-colorido.png")

class PlanoEstudosService:
    @staticmethod
    def criar(request, modalidade):
        _, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")
        ped_model_class, _ = validar_modalidade(modalidade, "PED")

        data = request.data.copy()

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        plano_estudos_instance = serializer.Meta.model(**serializer.validated_data)

        # Define a subquery conforme a modalidade
        if modalidade == "Integrado":
            responsavel_subquery = (
                ProfessorProgressaoIntegrado.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )
        else:
            responsavel_subquery = (
                ProfessorProgressaoProeja.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )

        ped = (
            ped_model_class.objects
            .annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField()))
            .get(id=uuid.UUID(data.get("ped")))
        )

        if str(ped.professor_ped) != TokenService.decode_token(request.COOKIES.get("access_token"))['user_id']:
            raise serializers.ValidationError("Acesso não autorizado")

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{str(ped.aluno.id)}/", "params": {"fields": "username"}},
            {"key": "professor_ped", "url": f"{base_url}/api/users/get/{str(ped.professor_ped)}/", "params": {"fields": "username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{str(ped.curso)}/", "params": {"fields": "name"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{str(ped.disciplina)}/", "params": {"fields": "name"}},
            {"key": "periodo_letivo", "url": f"{base_url}/api/calendars/get/{str(ped.periodo_letivo)}/", "params": {"fields": "start"}},
        ]

        # executa todas as requests simultaneamente
        dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)

        ped_dict = model_to_dict(ped)
        ped_dict.update(dados_ped)

        context_plano_estudos = flatten_named_fields({**ped_dict, **data}, ('name', 'username', 'start'))
        context_plano_estudos['ano'] = datetime.strptime(context_plano_estudos['periodo_letivo'], "%Y-%m-%d").year
        context_plano_estudos['logo'] = f"file:///{logo_path.replace(os.sep, '/')}"

        file = FileService.gerar_pdf('templates/parecer_inicial.html', context_plano_estudos)
        file.seek(0)
        pdf_base64 = base64.b64encode(file.read()).decode("utf-8")

        file.seek(0)
        plano_estudos_instance.drive_id = upload_to_drive(
            file,
            f'parecer_inicial_{context_plano_estudos.get("ped")}',
            TokenService.decode_token(request.COOKIES.get("access_token")).get("group"),
            DRIVE_FOLDER
        )

        plano_estudos_instance.save()
        
        ped.status = "Em Andamento"
        ped.data_inicio = datetime.today().date()
        ped.save()

        return pdf_base64
    
    @staticmethod
    def detalhes(request, modalidade, plano_estudos_id):
        model_class, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")

        plano_estudos = get_object_or_404(model_class, pk=uuid.UUID(plano_estudos_id))

        serializer = serializer_class(plano_estudos, context={'request': request})

        arquivo = get_from_drive(plano_estudos.drive_id, TokenService.decode_token(request.COOKIES.get('access_token'))['group'])

        return serializer.data, arquivo['data']

    @staticmethod
    def editar(request, modalidade, plano_estudos_id):
        model_class, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")
        ped_model_class = PEDIntegrado if modalidade == 'Integrado' else PEDProeja

        data = request.data.copy()

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        if modalidade == "Integrado":
            responsavel_subquery = (
                ProfessorProgressaoIntegrado.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )
        else:
            responsavel_subquery = (
                ProfessorProgressaoProeja.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )

        plano_estudos = get_object_or_404(model_class, pk=uuid.UUID(plano_estudos_id))
        ped = (
            ped_model_class.objects
            .annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField()))
            .get(id=uuid.UUID(data.get("ped")))
        )

        if ped.status not in ['Criada', 'Em Andamento']:
            raise serializers.ValidationError({"PED": "status da PED inválido para edição do plano de estudos"})

        if str(ped.professor_ped) != TokenService.decode_token(request.COOKIES.get("access_token"))['user_id']:
            raise serializers.ValidationError("Acesso não autorizado")

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{str(ped.aluno.id)}/", "params": {"fields": "username"}},
            {"key": "professor_ped", "url": f"{base_url}/api/users/get/{str(ped.professor_ped)}/", "params": {"fields": "username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{str(ped.curso)}/", "params": {"fields": "name"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{str(ped.disciplina)}/", "params": {"fields": "name"}},
            {"key": "periodo_letivo", "url": f"{base_url}/api/calendars/get/{str(ped.periodo_letivo)}/", "params": {"fields": "start"}},
        ]

        dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)

        ped_dict = model_to_dict(ped)

        ped_dict.update(dados_ped)

        context_plano_estudos = flatten_named_fields({**ped_dict, **data}, ('name', 'username', 'start'))
        context_plano_estudos['ano'] = datetime.strptime(context_plano_estudos['periodo_letivo'], "%Y-%m-%d").year
        context_plano_estudos['logo'] = context_plano_estudos['logo'] = f"file:///{logo_path.replace(os.sep, '/')}"

        file = FileService.gerar_pdf('templates/parecer_inicial.html', context_plano_estudos)
        file.seek(0)
        pdf_base64 = base64.b64encode(file.read()).decode("utf-8")

        file.seek(0)
        plano_estudos.drive_id = change_file(
            file,
            f'parecer_inicial_{context_plano_estudos.get("ped")}',
            plano_estudos.drive_id,
            DRIVE_FOLDER,
            TokenService.decode_token(request.COOKIES.get("access_token"))["group"],
        )

        for attr, value in serializer.validated_data.items():
            setattr(plano_estudos, attr, value)

        plano_estudos.save()

        return pdf_base64