import os
import threading
import uuid
from django.conf import settings
from rest_framework import serializers
from dependencias_app.services.notificacao_service import NotificacaoService
from dependencias_app.services.acesso_service import AcessoService
from dependencias_app.models.usuario import Usuario
from dependencias_app.utils.validar_modalidade import validar_modalidade
from dependencias_session.services.token_service import TokenService
from django.db import transaction

template_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_email", "planoDeAtividades.html")

class AvaliacaoService:
    @staticmethod
    def validar_professor(request):
        usuario_id = TokenService.decode_token(request.COOKIES.get(settings.AUTH_COOKIE_NAME)).get('user_id')

        professor = Usuario.objects.filter(id=usuario_id, group__name='professor').first()

        if professor is None:
            raise serializers.ValidationError("Usuário inválido")
        
        return professor
    
    @staticmethod
    def obter_atividades_por_ped(professor, modalidade, ped_id):
        ped_model_class, _ = validar_modalidade(modalidade, "PED")

        if modalidade == "Integrado":
            ped = ped_model_class.objects.filter(
                id=uuid.UUID(ped_id),
                professores_emi__professor=professor,
                professores_emi__responsavel_atual=True
            ).first()
            avaliacoes_ped = ped.atividades_emi.all()
        else:
            ped = ped_model_class.objects.filter(
                id=uuid.UUID(ped_id),
                professores_proeja__professor=professor,
                professores_proeja__responsavel_atual=True
            ).first()
            avaliacoes_ped = ped.atividades_proeja.all()

        if ped is None:
            raise serializers.ValidationError("Progressão não encontrada para o usuário solicitante")
        
        return ped, avaliacoes_ped

    @staticmethod
    @transaction.atomic
    def salvar_plano_atividades(request, modalidade, ped_id):
        avaliacao_model_class, avaliacao_serializer_class = validar_modalidade(modalidade, "Avaliacao")

        professor = AvaliacaoService.validar_professor(request)
        ped, avaliacoes_ped = AvaliacaoService.obter_atividades_por_ped(professor, modalidade, ped_id)

        dados = request.data.copy()

        if ped.status != "Em Andamento":
            raise serializers.ValidationError("O plano de atividades desta dependência não pode ser alterado, pois ela não está em andamento.")

        # normalizar os dados recebidos
        for item in dados:
            if isinstance(item.get("atividade"), dict):
                item["atividade"] = item["atividade"]["id"]

            if item.get("nota") == "" or item.get("nota") is None:
                item["nota"] = None
            else:
                if isinstance(item["nota"], str):
                    item["nota"] = item["nota"].replace(",", ".")

                try:
                    item["nota"] = float(item["nota"])
                    item["status"] = "Avaliada"
                except:
                    item["nota"] = None

        if not avaliacoes_ped.exists():
            serializer = avaliacao_serializer_class(data=dados, many=True)
        else:
            serializer = avaliacao_serializer_class(instance=avaliacoes_ped, data=dados, many=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        if modalidade == "Integrado":
            ped.atividades_emi.all().delete()
        else:
            ped.atividades_proeja.all().delete()

        avaliacao_model_class.objects.bulk_create([avaliacao_model_class(**item) for item in serializer.validated_data])

        transaction.on_commit(
            lambda: threading.Thread(
                target=NotificacaoService.criar_notificacao,
                args=([{'id': str(ped.aluno.id), 'grupo': 'aluno'}], template_path, "Plano de atividades alterado", ped),
                daemon=True
            ).start()
        )

    
    @staticmethod
    def listar_avaliacoes(request, modalidade, ped_id):
        _, avaliacao_serializer_class = validar_modalidade(modalidade, "Avaliacao")

        _, ped = AcessoService.validar_acesso(request, modalidade, ped_id)

        if modalidade == 'Integrado':
            avaliacoes = ped.atividades_emi.all()
        if modalidade == 'ProEJA':
            avaliacoes = ped.atividades_proeja.all()

        serializer = avaliacao_serializer_class(avaliacoes, many=True, context={'request': request})

        return serializer.data