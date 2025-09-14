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
            params={'search': busca, 'active': 'true', 'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_professor = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/group/professor/', 
            params={'search': busca, 'active': 'true', 'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_cursos = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/courses/get/', 
            params={'search': busca, 'fields': 'id, name'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_disciplinas = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/subjects/get/', 
            params={'search': busca, 'fields': 'id, name'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])

        alunos_map = {str(aluno["id"]): aluno["username"] for aluno in lista_aluno}
        professores_map = {str(prof["id"]): prof["username"] for prof in lista_professor}
        cursos_map = {str(curso["id"]): curso["name"] for curso in lista_cursos}
        disciplinas_map = {str(disciplina["id"]): disciplina["name"] for disciplina in lista_disciplinas}

        alunos_ids = list(alunos_map.keys())
        professores_ids = list(professores_map.keys())
        cursos_ids = list(cursos_map.keys())
        disciplinas_ids = list(disciplinas_map.keys())

        professor_field = ("professores_emi" if hasattr(model_class, "professores_emi") else "professores_proeja")

        peds = model_class.objects.filter(
            Q(aluno__in=[uuid.UUID(aluno_id) for aluno_id in alunos_ids]) |
            Q(**{f"{professor_field}__in": [uuid.UUID(pid) for pid in professores_ids]}, **{f"{professor_field}__responsavel_atual": True}) |
            Q(professor_disciplina__in=[uuid.UUID(professor_disciplina_id) for professor_disciplina_id in professores_ids]) |
            Q(disciplina__in=[uuid.UUID(disciplina_id) for disciplina_id in disciplinas_ids]) |
            Q(curso__in=[uuid.UUID(curso_id) for curso_id in cursos_ids])
        )

        paginator = PEDPagination()
        paginated_result = paginator.paginate_queryset(peds, request)

        serializer = serializer_class(paginated_result, many=True, context={'request': request})

        data = serializer.data

        for item in data:
            if item.get("aluno") in alunos_map:
                item["aluno"] = alunos_map[item["aluno"]]
            if item.get(f"{professor_field}") in professores_map:
                item[f"{professor_field}"] = professores_map[item[f"{professor_field}"]]
            if item.get("professor_disciplina") in professores_map:
                item["professor_disciplina"] = professores_map[item["professor_disciplina"]]
            if item.get("curso") in professores_map:
                item["curso"] = professores_map[item["curso"]]
            if item.get("disciplina") in professores_map:
                item["disciplina"] = professores_map[item["disciplina"]]
            

        return paginator.get_paginated_response(data)

    @staticmethod
    def detalhes(ped_id):
        ped = get_object_or_404(PEDIntegrado, pk=uuid.UUID(ped_id))