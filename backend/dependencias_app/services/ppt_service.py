import requests
import uuid
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from ..models.ppt import PPT
from ..serializers.ppt_serializer import PPTSerializer
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.mapear_dados import mapear_fk_para_objetos
from ..services.usuario_service import CustomUserService

class PPTPagintaion(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

class PPTService:
    @staticmethod
    @transaction.atomic
    def criar(ppt_data):
        CustomUserService.criar_aluno(ppt_data.get("aluno"))

        serializer = PPTSerializer(data=ppt_data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def listar(request):
        busca = request.GET.get('busca', '')

        lista_aluno = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/access_profile/aluno/', 
            params={'search': busca, 'active': 'true', 'fields': 'id, username', 'page_size': 150},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_professor = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/access_profile/servidor/', 
            params={'search': busca, 'active': 'true', 'fields': 'id, username', 'page_size': 150},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_curso = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/courses/get/', 
            params={'search': busca, 'fields': 'id, name, course_class.id, course_class.number'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/subjects/get/', 
            params={'search': busca, 'fields': 'id, name', 'page_size': 100},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])

        lista_peds = PPT.objects.filter(
            Q (aluno__in=[uuid.UUID(aluno['id']) for aluno in lista_aluno]) |
            Q (professor_disciplina__in=[uuid.UUID(professor['id']) for professor in lista_professor]) |
            Q (professor_ppt__in=[uuid.UUID(professor['id']) for professor in lista_professor]) |
            Q (curso__in=[uuid.UUID(curso['id']) for curso in lista_curso]) |
            Q (disciplina__in=[uuid.UUID(disciplina['id']) for disciplina in lista_disciplina])
        )

        serializer = PPTSerializer(lista_peds, context={'request': request}, many=True)

        turmas = []
        for curso in lista_curso:
            for turma in curso.get('course_class', []):
                turmas.append({
                    'id': turma['id'],
                    'number': turma['number']
                })


        api_data_map = {
            'aluno': lista_aluno,
            'professor_ppt': lista_professor,
            'professor_disciplina': lista_professor,
            'curso': lista_curso,
            'disciplina': lista_disciplina,
            'turma_atual': turmas,
            'turma_progressao': turmas
        }

        resultado = mapear_fk_para_objetos(serializer.data, api_data_map, request.GET.get("formato"))

        paginator = PPTPagintaion()
        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def detalhes(request, ppt_id):
        ppt = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))

        aluno = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(ppt.aluno.id)}/',
            params={'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json()

        professor_disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(ppt.professor_disciplina.id)}/', 
            params={'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json()

        professor_ppt = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(ppt.professor_ppt.id)}/', 
            params={'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json()

        curso = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/courses/get/{str(ppt.curso)}', 
            params={'fields': 'id, name, course_class.id, course_class.number'},
            cookies={'system': settings.API_KEY}
        ).json()

        disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/subjects/get/{str(ppt.disciplina)}', 
            params={'fields': 'id, name'},
            cookies={'system': settings.API_KEY}
        ).json()

        serializer = PPTSerializer(ppt, context={'request': request})

        turmas = curso.get('course_class')
        turma_atual = None
        turma_progressao = None

        for turma in turmas:
            if turma['id'] == str(ppt.turma_atual):
                turma_atual = turma
            if turma['id'] == str(ppt.turma_progressao):
                turma_progressao = turma

        api_data_map = {
            'aluno': [aluno],
            'professor_disciplina': [professor_disciplina],
            'professor_ppt': [professor_ppt],
            'curso': [curso],
            'disciplina': [disciplina],
            'turma_atual': [turma_atual],
            'turma_progressao': [turma_progressao]
        }

        retorno_mapeado = mapear_fk_para_objetos([serializer.data], api_data_map, request.GET.get("formato"))[0]

        return retorno_mapeado

    @staticmethod
    @transaction.atomic
    def editar(ppt_data, ppt_id):
        ped = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))
        CustomUserService.criar_aluno(ppt_data.get('aluno'))

        serializer = PPTSerializer(instance=ped, data=ppt_data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()
