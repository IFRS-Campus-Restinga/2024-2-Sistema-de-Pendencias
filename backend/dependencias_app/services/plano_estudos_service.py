import uuid
from rest_framework import serializers
from ..utils.validar_modalidade import validar_modalidade
from ..utils.formatar_obj import formatar_obj
from django.conf import settings
from django.db.models import OuterRef, Subquery, UUIDField
from django.forms.models import model_to_dict
from ..models.ped_integrado import PEDIntegrado
from ..models.ped_proeja import PEDProEJA
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProEJA
from .ped_service import AsyncRequestService

DRIVE_FOLDER = settings.DRIVE_PLANO_ESTUDOS_FOLDER
cookies = {"system": settings.API_KEY}
base_url = settings.BASE_SYSTEM_URL

class PlanoEstudosService:
    @staticmethod
    def criar(data, modalidade):
        _, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")
        ped_model_class = PEDIntegrado if modalidade == 'Integrado' else PEDProEJA

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        plano_estudos = serializer.save()

        if modalidade == "Integrado":
            responsavel_subquery = ProfessorProgressaoIntegrado.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True
            ).values('professor')[:1]
        else:
            responsavel_subquery = ProfessorProgressaoProEJA.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True,
            ).values('professor')[:1]

        ped = ped_model_class.objects.get(plano_estudos=plano_estudos).annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField()))

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{ped['aluno']}/", "params": {"fields": "username"}},
            {"key": "professor_ped", "url": f"{base_url}/api/users/get/{ped['professor_ped']}/", "params": {"fields": "username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ped['curso']}/", "params": {"fields": "name"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ped['disciplina']}/", "params": {"fields": "name"}},
            {"key": "periodo_letivo", "url": f"{base_url}/api/calendar/get/{ped['periodo_letivo']}/", "params": {"fields": "start"}},
        ]

        try:
            # executa todas as requests simultaneamente
            dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)

            plano_dict = model_to_dict(plano_estudos)

            dados_plano_estudos = formatar_obj({**dados_ped, **plano_dict}, 'flat')

            print(dados_plano_estudos)
        except Exception as e:
            raise Exception(f"Erro ao buscar dados do PED {ped['id']}: {str(e)}")



