import uuid
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from dependencias_session.services.token_service import TokenService
from ..models.ppt import PPT
from ..serializers.ppt_serializer import PPTSerializer
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.formatar_obj import formatar_obj
from ..services.usuario_service import UsuarioService
from .async_request_service import AsyncRequestService


class PPTPagintation(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

class PPTService:
    @staticmethod
    @transaction.atomic
    def criar(ppt_data):
        UsuarioService.criar_aluno(ppt_data.get("aluno"))

        serializer = PPTSerializer(data=ppt_data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def listar(request):
        busca = request.GET.get('busca', '')

        paginator = PPTPagintation()

        ppts = PPT.objects.all().order_by('-data_criacao')

        lista_ppts = PPTSerializer(ppts, context={'request': request}, many=True)
        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        for ppt in lista_ppts.data:
            if len(resultado) == paginator.page_size + 1:
                break
            else:
                tasks = [
                    {"key": "aluno", "url": f"{base_url}/api/users/get/{ppt['aluno']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ppt['professor_disciplina']}/", "params": {"fields": "id,username"}},
                    {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{ppt['professor_ppt']}/", "params": {"fields": "id,username"}},
                    {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ppt['curso']}/", "params": {"fields": "id,name"}},
                    {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ppt['disciplina']}/", "params": {"fields": "id,name"}},
                ]

                try:
                    dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                    ppt.update(dados_ppt)

                    turma_atual_id = ppt['turma_atual']
                    turma_progressao_id = ppt['turma_progressao']
                    turmas = ppt['curso'].get('course_class', [])

                    # filtra a turma correta
                    ppt['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)
                    ppt['turma_progressao'] = next((turma for turma in turmas if turma['id'] == turma_progressao_id), None)

                    # filtro de busca
                    if busca.strip():
                        busca_lower = busca.lower()
                        if any(busca_lower in str(v).lower() for v in ppt.values() if v is not None):
                            resultado.append(formatar_obj(ppt, request.GET.get("formato")))
                    else:
                        resultado.append(formatar_obj(ppt, request.GET.get("formato")))

                except Exception as e:
                    raise Exception(f"Erro ao buscar dados do PPT {ppt['id']}: {str(e)}")

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def listar_coordenador(request):
        pass

    @staticmethod
    def listar_aluno(request):
        aluno_id = uuid.UUID(TokenService.decode_token(request.COOKIES.get("access_token")).get("user_id"))
        filtros = request.GET.getlist("params[]", [])

        ppts = PPT.objects.filter(aluno__id=aluno_id).order_by('-data_criacao')

        if filtros:
            ppts = ppts.filter(status__in=filtros)

        PPTSerializer(ppts, many=True, context={'request': request})

        paginator = PPTPagintation()

        try:
            page = paginator.paginate_queryset(ppts, request)
        except NotFound:
            return Response({"results": []})

        if not page:
            return Response({"results": []})

        lista_serializada = PPTSerializer(page, many=True, context={'request': request}).data

        base_url = settings.BASE_SYSTEM_URL
        cookies = {"system": settings.API_KEY}

        resultado = []

        for ppt in lista_serializada:

            tasks = [
                {
                    "key": "curso",
                    "url": f"{base_url}/api/academic/courses/get/{ppt['curso']}/",
                    "params": {"fields": "name, course_class.id, course_class.number"},
                },
                {
                    "key": "disciplina",
                    "url": f"{base_url}/api/academic/subjects/get/{ppt['disciplina']}/",
                    "params": {"fields": "name"},
                },
                {
                    "key": "professor_ppt",
                    "url": f"{base_url}/api/users/get/{ppt['professor_ppt']}/",
                    "params": {"fields": "username"},
                }
            ]

            try:
                dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                ppt.update(dados_ppt)

                turma_atual_id = ppt['turma_atual']
                turmas = ppt['curso'].get('course_class', [])

                # filtra a turma correta
                ppt['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)

                resultado.append(formatar_obj(ppt, request.GET.get("formato")))

            except Exception as e:
                raise Exception(f"Erro ao enriquecer PPT {ppt['id']}: {str(e)}")

        return paginator.get_paginated_response(resultado)

    @staticmethod
    def detalhes(request, ppt_id):
        ppt = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))

        serializer = PPTSerializer(ppt, context={"request": request})

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        # O model PPT deve ser acessado com ".", não com "[]"
        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{str(ppt.aluno.id)}/", "params": {"fields": "id,username"}},
            {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{str(ppt.professor_disciplina.id)}/", "params": {"fields": "id,username"}},
            {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{str(ppt.professor_ppt.id)}/", "params": {"fields": "id,username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{str(ppt.curso)}/", "params": {"fields": "id,name,course_class.id,course_class.number"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{str(ppt.disciplina)}/", "params": {"fields": "id,name"}},
        ]

        try:
            dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)

            # ↓ campos do model
            turma_atual_id = ppt.turma_atual
            turma_progressao_id = ppt.turma_progressao

            # ↓ turmas vem da API (dentro de dados_ppt['curso'])
            turmas = dados_ppt["curso"].get("course_class", [])

            dados_ppt["turma_atual"] = next(
                (t for t in turmas if t["id"] == turma_atual_id), None
            )

            dados_ppt["turma_progressao"] = next(
                (t for t in turmas if t["id"] == turma_progressao_id), None
            )

            # serializer.data já contém o PPT serializado
            ppt_dict = serializer.data.copy()
            ppt_dict.update(dados_ppt)

        except Exception as e:
            raise Exception(f"Erro ao buscar dados do PPT {ppt.id}: {str(e)}")

        return formatar_obj(ppt_dict, request.GET.get("formato"))


    @staticmethod
    @transaction.atomic
    def editar(ppt_data, ppt_id):
        ped = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))
        UsuarioService.criar_aluno(ppt_data.get('aluno'))

        serializer = PPTSerializer(instance=ped, data=ppt_data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()
