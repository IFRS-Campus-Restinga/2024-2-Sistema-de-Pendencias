import uuid
from rest_framework import serializers
from dependencias_app.models.usuario import Usuario
from dependencias_app.utils.validar_modalidade import validar_modalidade
from dependencias_session.services.token_service import TokenService
from django.db import transaction


class AvaliacaoService:
    @staticmethod
    def validar_professor(request):
        usuario_id = TokenService.decode_token(request.COOKIES.get("access_token")).get('user_id')

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
    
    @staticmethod
    def listar_avaliacoes(request, modalidade, ped_id):
        _, avaliacao_serializer_class = validar_modalidade(modalidade, "Avaliacao")
        ped_model_class, _ = validar_modalidade(modalidade, "PED")

        payload = TokenService.decode_token(request.COOKIES.get("access_token"))

        if payload.get("group") == "gestao_escolar":
            ped = ped_model_class.objects.get(id=uuid.UUID(ped_id))
        if payload.get("group") == "aluno":
            ped = ped_model_class.objects.get(id=uuid.UUID(ped_id), aluno__id=uuid.UUID(payload.get("user_id")))
        if payload.get("group") == "professor":
            professor = AvaliacaoService.validar_professor(request)
            _, avaliacoes_ped = AvaliacaoService.obter_atividades_por_ped(professor, modalidade, ped_id)

            serializer = avaliacao_serializer_class(avaliacoes_ped, many=True, context={'request': request})

            return serializer.data


        if modalidade == 'Integrado':
            avaliacoes = ped.atividades_emi.all()
        if modalidade == 'Proeja':
            avaliacoes = ped.atividades_proeja.all()

        serializer = avaliacao_serializer_class(avaliacoes, many=True, context={'request': request})

        return serializer.data