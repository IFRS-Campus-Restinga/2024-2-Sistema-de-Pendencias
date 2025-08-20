import requests
import uuid
from django.db.models import Q
from ..models.ped_integrado import PEDIntegrado
from rest_framework import serializers
from ..serializers.ped_integrado_serializer import PEDIntegradoSerializer
from ..serializers.ped_ProEJA_serializer import PEDProEJASerializer
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.pagination import PageNumberPagination
from ..utils.validar_modalidade_ped import validar_modalidade

class PEDPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

class PEDService:
    @staticmethod
    def criar(ped_data, modalidade):
        _, serializer_class = validar_modalidade(modalidade)

        serializer = serializer_class(data=ped_data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def listar(request, modalidade):
        model_class, serializer_class = validar_modalidade(modalidade)
        busca = request.GET.get('busca', '')

        lista_aluno = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/group/aluno/', 
            params={'search': busca, 'active': 'true', 'data_format': 'search'},
            cookies={'system': settings.SYSTEM_ID}
        ).json()
        lista_professor = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/group/professor/', 
            params={'search': busca, 'active': 'true', 'data_format': 'search'},
            cookies={'system': settings.SYSTEM_ID}
        ).json()

        alunos_map = {str(aluno["id"]): aluno["title"] for aluno in lista_aluno}
        professores_map = {str(prof["id"]): prof["title"] for prof in lista_professor}

        alunos_ids = list(alunos_map.keys())
        professores_ids = list(professores_map.keys())

        peds = model_class.objects.filter(
            Q(aluno__in=[uuid.UUID(aluno_id) for aluno_id in alunos_ids]) |
            Q(professor_ped__in=[uuid.UUID(professor_ped_id) for professor_ped_id in professores_ids]) |
            Q(professor_disciplina__in=[uuid.UUID(professor_disciplina_id) for professor_disciplina_id in  professores_ids])
        )

        paginator = PEDPagination()
        paginated_result = paginator.paginate_queryset(peds, request)

        serializer = serializer_class(data=paginated_result, many=True, context={'request': request})

        data = serializer.data

        # aqui substitui IDs pelos nomes
        for item in data:
            if item.get("aluno") in alunos_map:
                item["aluno"] = alunos_map[item["aluno"]]
            if item.get("professor_ped") in professores_map:
                item["professor_ped"] = professores_map[item["professor_ped"]]
            if item.get("professor_disciplina") in professores_map:
                item["professor_disciplina"] = professores_map[item["professor_disciplina"]]

        return paginator.get_paginated_response(data)

    @staticmethod
    def detalhes(ped_id):
        ped = get_object_or_404(PEDIntegrado, pk=uuid.UUID(ped_id))