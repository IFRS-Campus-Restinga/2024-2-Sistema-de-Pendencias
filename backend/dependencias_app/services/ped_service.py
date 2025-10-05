import requests
import uuid
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import OuterRef, Subquery, UUIDField, Q
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProEJA
from ..models.custom_user import CustomUser
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.validar_modalidade_ped import validar_modalidade
from ..utils.mapear_dados import mapear_fk_para_objetos
from ..services.usuario_service import CustomUserService

class PEDPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

class PEDService:
    @staticmethod
    @transaction.atomic
    def criar(ped_data, modalidade):
        _, serializer_class = validar_modalidade(modalidade)

        CustomUserService.criar_aluno(ped_data.get("aluno"))

        serializer = serializer_class(data=ped_data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        ped_instance = serializer.save()

        professor = get_object_or_404(CustomUser, pk=uuid.UUID(ped_data.get("professor_ped")))

        if modalidade == 'Integrado':
            ProfessorProgressaoIntegrado.objects.create(
                professor=professor,
                responsavel_atual=True,
                ped=ped_instance
            )
        else:
            ProfessorProgressaoProEJA.objects.create(
                professor=professor,
                responsavel_atual=True,
                ped=ped_instance
            )

    @staticmethod
    def listar(request, modalidade):
        model_class, serializer_class = validar_modalidade(modalidade)
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
            params={'search': busca, 'fields': 'id, name'},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])
        lista_disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/subjects/get/', 
            params={'search': busca, 'fields': 'id, name', 'page_size': 100},
            cookies={'system': settings.API_KEY}
        ).json().get('results', [])

        if modalidade == "Integrado":
            responsavel_subquery = ProfessorProgressaoIntegrado.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True,
                professor__in=[uuid.UUID(prof['id']) for prof in lista_professor]
            ).values('professor')[:1]
        else:
            responsavel_subquery = ProfessorProgressaoProEJA.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True,
                professor__in=[uuid.UUID(prof['id']) for prof in lista_professor]
            ).values('professor')[:1]

        lista_peds = model_class.objects.filter(
            Q (aluno__in=[uuid.UUID(aluno['id']) for aluno in lista_aluno]) |
            Q (professor_disciplina__in=[uuid.UUID(professor['id']) for professor in lista_professor]) |
            Q (curso__in=[uuid.UUID(curso['id']) for curso in lista_curso]) |
            Q (disciplina__in=[uuid.UUID(disciplina['id']) for disciplina in lista_disciplina])
        ).annotate(
            professor_ped=Subquery(responsavel_subquery, output_field=UUIDField())
        )

        serializer = serializer_class(lista_peds, context={'request': request}, many=True)

        api_data_map = {
            'aluno': lista_aluno,
            'professor_ped': lista_professor,
            'professor_disciplina': lista_professor,
            'curso': lista_curso,
            'disciplina': lista_disciplina
        }

        resultado = mapear_fk_para_objetos(serializer.data, api_data_map, request.GET.get("formato"))

        paginator = PEDPagination()
        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def detalhes(request, modalidade, ped_id):
        model_class, serializer_class = validar_modalidade(modalidade)

        ped = get_object_or_404(model_class, pk=uuid.UUID(ped_id))

        aluno = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(ped.aluno.id)}/',
            params={'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json()

        professor_disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(ped.professor_disciplina.id)}/', 
            params={'fields': 'id, username'},
            cookies={'system': settings.API_KEY}
        ).json()

        attr = 'professores_emi' if modalidade == 'Integrado' else 'professores_proeja'
        lista_professores = []
        for professor in getattr(ped, attr).all():
            professor_hub = requests.get(
                f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(professor.professor.id)}/', 
                params={'fields': 'id, username'},
                cookies={'system': settings.API_KEY}
            ).json()

            lista_professores.append(professor_hub)

        curso = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/courses/get/{str(ped.curso)}', 
            params={'fields': 'id, name, course_class.id, course_class.number'},
            cookies={'system': settings.API_KEY}
        ).json()

        disciplina = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/subjects/get/{str(ped.disciplina)}', 
            params={'fields': 'id, name'},
            cookies={'system': settings.API_KEY}
        ).json()

        periodo_letivo = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/calendars/get/{str(ped.periodo_letivo)}', 
            params={'fields': 'id, title'},
            cookies={'system': settings.API_KEY}
        ).json()

        serializer = serializer_class(ped, context={'request': request})

        turmas = curso.get('course_class')
        turma_atual = None

        for turma in turmas:
            if turma['id'] == str(ped.turma_atual):
                turma_atual = turma

        api_data_map = {
            'aluno': [aluno],
            'professor_disciplina': [professor_disciplina],
            'curso': [curso],
            'disciplina': [disciplina],
            'periodo_letivo': [periodo_letivo],
            'turma_atual': [turma_atual]
        }

        if "professor_ped" in request.GET.get("retorno"):
            api_data_map['professor_ped'] = lista_professores

        retorno_mapeado = mapear_fk_para_objetos([serializer.data], api_data_map, request.GET.get("formato"))[0]

        if "professores" in request.GET.get("retorno"):
            professores_ped = []
            for professor_ped in retorno_mapeado['professores']:
                for professor_hub in lista_professores:
                    if professor_hub['id'] == professor_ped['id']:
                        professores_ped.append({
                            'nome': professor_hub['username'],
                            'resp_atual': professor_ped['resp_atual']
                        })

            retorno_mapeado['professores'] = professores_ped

        return retorno_mapeado

    @staticmethod
    @transaction.atomic
    def editar(ped_data, ped_id, modalidade):
        model_class, serializer_class = validar_modalidade(modalidade)
        ped = get_object_or_404(model_class, pk=uuid.UUID(ped_id))
        CustomUserService.criar_aluno(ped_data.get('aluno'))

        serializer = serializer_class(instance=ped, data=ped_data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

        professor = get_object_or_404(CustomUser, pk=uuid.UUID(ped_data.get("professor_ped")))

        if modalidade == 'Integrado':
            ProfessorProgressaoIntegrado.objects.filter(ped=serializer.instance).exclude(professor=professor).update(responsavel_atual=False)

            ProfessorProgressaoIntegrado.objects.get_or_create(
                professor=professor,
                ped=serializer.instance,
                defaults={
                    "responsavel_atual": True
                }
            )
        else:
            ProfessorProgressaoIntegrado.objects.filter(ped=serializer.instance).exclude(professor=professor).update(responsavel_atual=False)

            ProfessorProgressaoProEJA.objects.get_or_create(
                professor=professor,
                ped=serializer.instance,
                defaults={
                    "responsavel_atual": True,
                }
            )
