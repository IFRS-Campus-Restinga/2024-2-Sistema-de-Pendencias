import uuid
from django.conf import settings
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.db.models import OuterRef, Subquery, UUIDField
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProEJA
from ..models.usuario import Usuario
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.validar_modalidade import validar_modalidade
from ..utils.formatar_obj import formatar_obj
from ..services.usuario_service import UsuarioService
from dependencias_session.services.token_service import TokenService
from .async_request_service import AsyncRequestService

class PEDPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

class PEDService:
    @staticmethod
    @transaction.atomic
    def criar(ped_data, modalidade):
        _, serializer_class = validar_modalidade(modalidade, 'PED')

        UsuarioService.criar_aluno(ped_data.get("aluno"))

        serializer = serializer_class(data=ped_data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        ped_instance = serializer.save()

        professor = get_object_or_404(Usuario, pk=uuid.UUID(ped_data.get("professor_ped")))

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
        model_class, serializer_class = validar_modalidade(modalidade, 'PED')
        busca = request.GET.get('busca', '')

        paginator = PEDPagination()

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

        peds = model_class.objects.all().annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField())).order_by('-data_criacao')

        lista_peds = serializer_class(peds, context={'request': request}, many=True)
        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        for ped in lista_peds.data:
            if len(resultado) < paginator.page_size:
                # monta tasks diretamente na listagem
                tasks = [
                    {"key": "aluno", "url": f"{base_url}/api/users/get/{ped['aluno']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ped['professor_disciplina']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_ped", "url": f"{base_url}/api/users/get/{ped['professor_ped']}/", "params": {"fields": "id,username"}},
                    {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ped['curso']}/", "params": {"fields": "id,name"}},
                    {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ped['disciplina']}/", "params": {"fields": "id,name"}},
                ]

                try:
                    # executa todas as requests simultaneamente
                    dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                    ped.update(dados_ped)

                    # filtro de busca
                    if busca.strip():
                        busca_lower = busca.lower()
                        if any(busca_lower in str(v).lower() for v in ped.values() if v is not None):
                            resultado.append(formatar_obj(ped, request.GET.get("formato")))
                    else:
                        resultado.append(formatar_obj(ped, request.GET.get("formato")))

                except Exception as e:
                    raise Exception(f"Erro ao buscar dados do PED {ped['id']}: {str(e)}")
        

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def listar_professor(request, modalidade):
        professor_id = TokenService.decode_token(request.COOKIES.get("access_token")).get("user_id")

        model_class, serializer_class = validar_modalidade(modalidade, 'PED')
        busca = request.GET.get('busca', '')

        paginator = PEDPagination()

        if modalidade == "Integrado":
            peds = model_class.objects.filter(
                professores_emi__professor__id=uuid.UUID(professor_id),
                professores_emi__responsavel_atual=True
            ).annotate(
                professor_ped=models.F('professores_emi__professor')
            ).order_by('-data_criacao')

        else:
            peds = model_class.objects.filter(
                professores_proeja__professor__id=uuid.UUID(professor_id),
                professores_proeja__responsavel_atual=True
            ).annotate(
                professor_ped=models.F('professores_proeja__professor')
            ).order_by('-data_criacao')

        lista_peds = serializer_class(peds, context={'request': request}, many=True)
        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        for ped in lista_peds.data:
            if len(resultado) < paginator.page_size:
                # monta tasks diretamente na listagem
                tasks = [
                    {"key": "aluno", "url": f"{base_url}/api/users/get/{ped['aluno']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ped['professor_disciplina']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_ped", "url": f"{base_url}/api/users/get/{ped['professor_ped']}/", "params": {"fields": "id,username"}},
                    {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ped['curso']}/", "params": {"fields": "id,name"}},
                    {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ped['disciplina']}/", "params": {"fields": "id,name"}},
                ]

                try:
                    # executa todas as requests simultaneamente
                    dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                    ped.update(dados_ped)

                    # filtro de busca
                    if busca.strip():
                        busca_lower = busca.lower()
                        if any(busca_lower in str(v).lower() for v in ped.values() if v is not None):
                            resultado.append(formatar_obj(ped, request.GET.get("formato")))
                    else:
                        resultado.append(formatar_obj(ped, request.GET.get("formato")))

                except Exception as e:
                    raise Exception(f"Erro ao buscar dados do PED {ped['id']}: {str(e)}")
        

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def listar_coordenador(request, modalidade):
        coordenador_id = TokenService.decode_token(request.COOKIES.get("access_token")).get("user_id")

        model_class, serializer_class = validar_modalidade(modalidade, 'PED')
        busca = request.GET.get('busca', '')

        paginator = PEDPagination()

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

        peds = model_class.objects.all().annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField())).order_by('-data_criacao')

        lista_peds = serializer_class(peds, context={'request': request}, many=True)
        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        for ped in lista_peds.data:
            if len(resultado) < paginator.page_size:
                # monta tasks diretamente na listagem
                tasks = [
                    {"key": "aluno", "url": f"{base_url}/api/users/get/{ped['aluno']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ped['professor_disciplina']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_ped", "url": f"{base_url}/api/users/get/{ped['professor_ped']}/", "params": {"fields": "id,username"}},
                    {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ped['curso']}/", "params": {"fields": "id,name,coord.id"}},
                    {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ped['disciplina']}/", "params": {"fields": "id,name"}},
                ]

                try:
                    # executa todas as requests simultaneamente
                    dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                    ped.update(dados_ped)

                    print(dados_ped)

                    curso_coord_id = str(dados_ped['course']['coord']['id'])

                    if curso_coord_id == str(coordenador_id):
                        # filtro de busca
                        if busca.strip():
                            busca_lower = busca.lower()
                            if any(busca_lower in str(v).lower() for v in ped.values() if v is not None):
                                resultado.append(formatar_obj(ped, request.GET.get("formato")))
                        else:
                            resultado.append(formatar_obj(ped, request.GET.get("formato")))

                except Exception as e:
                    raise Exception(f"Erro ao buscar dados do PED {ped['id']}: {str(e)}")
        

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def detalhes(request, modalidade, ped_id):
        retorno = request.GET.get("retorno", None)

        model_class, serializer_class = validar_modalidade(modalidade, 'PED')

        ped = get_object_or_404(model_class, pk=uuid.UUID(ped_id))
        serializer = serializer_class(ped, context={'request': request})

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        # Monta os campos que vão para a request do curso
        curso_fields = "id,name"
        if modalidade == "Integrado":
            curso_fields += ",course_class.id,course_class.number"

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{serializer.data['aluno']}/", "params": {"fields": "id,username"}},
            {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{serializer.data['professor_disciplina']}/", "params": {"fields": "id,username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{serializer.data['curso']}/", "params": {"fields": curso_fields}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{serializer.data['disciplina']}/", "params": {"fields": "id,name"}},
        ]

        if "professor_ped" in retorno:
            prof_atual = serializer.data.get("professor_ped")
            if prof_atual:
                tasks.append({
                    "key": "professor_ped",
                    "url": f"{base_url}/api/users/get/{str(prof_atual)}/",
                    "params": {"fields": "id,username"}
                })

        if "professores" in retorno:
            for i, prof in enumerate(serializer.data.get("professores", [])):
                tasks.append({
                    "key": f"professor_{i}",
                    "url": f"{base_url}/api/users/get/{str(prof['id'])}/",
                    "params": {"fields": "id, username"}
                })

        try:
            dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)

            # Monta a lista agregada de professores se necessário
            ped_dict = serializer.data.copy()

            if "professores" in retorno:
                professores = []
                for i, prof_obj in enumerate(serializer.data['professores']):
                    professor_id = str(prof_obj['id'])
                    resp_atual = prof_obj['resp_atual']
                    professor_req = dados_ped.get(f"professor_{i}", {})
                    professores.append({
                        "id": professor_id,
                        "username": professor_req.get("username"),
                        "resp_atual": resp_atual
                    })
                    dados_ped.pop(f"professor_{i}", None)

                dados_ped["professores"] = professores
            
            # Define turma atual e, se necessário, número e ID da turma
            if ped_dict.get('turma_atual'):
                turmas = dados_ped['curso']['course_class']
                turma_atual_id = ped_dict.get("turma_atual")  # assumindo que existe este campo
                turma_atual = next((t for t in turmas if str(t['id']) == str(turma_atual_id)), None)
                ped_dict["turma_atual"] = turma_atual


            ped_dict.update(dados_ped)

            if ped_dict.get('curso'):
                print(dados_ped['curso']['name'])
                ped_dict['curso'] = dados_ped['curso']['name']
                
        except Exception as e:
            raise Exception(f"Erro ao buscar dados do PED {ped.id}: {str(e)}")

        return formatar_obj(ped_dict, request.GET.get("formato"))

    @staticmethod
    @transaction.atomic
    def editar(ped_data, ped_id, modalidade):
        model_class, serializer_class = validar_modalidade(modalidade, 'PED')
        ped = get_object_or_404(model_class, pk=uuid.UUID(ped_id))
        UsuarioService.criar_aluno(ped_data.get('aluno'))

        serializer = serializer_class(instance=ped, data=ped_data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

        professor = get_object_or_404(Usuario, pk=uuid.UUID(ped_data.get("professor_ped")))

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
