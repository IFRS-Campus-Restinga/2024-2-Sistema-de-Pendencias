import threading
import uuid
from datetime import datetime
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

    def get_page_number(self, request, paginator):
        return 1

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
        ultimo_valor_cursor = request.GET.get('cursor')

        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        while len(resultado) < paginator.page_size + 1:
            filtro = {}
            if ultimo_valor_cursor:
                filtro['data_criacao__lt'] = ultimo_valor_cursor

            ppt = (
                PPT.objects
                .filter(**filtro)
                .order_by('-data_criacao')
                .first()
            )

            if not ppt:
                break

            ppt_serializado = PPTSerializer(ppt, context={'request': request}).data
            tasks = [
                {"key": "aluno", "url": f"{base_url}/api/users/get/{ppt_serializado['aluno']}/", "params": {"fields": "id,username"}},
                {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_disciplina']}/", "params": {"fields": "id,username"}},
                {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_ppt']}/", "params": {"fields": "id,username"}},
                {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ppt_serializado['curso']}/", "params": {"fields": "id,name, course_class.id, course_class.number"}},
                {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ppt_serializado['disciplina']}/", "params": {"fields": "id,name"}},
            ]

            try:
                dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                ppt_final = {**ppt_serializado, **dados_ppt}

                turma_atual_id = ppt_final['turma_atual']
                turma_progressao_id = ppt_final['turma_progressao']
                turmas = ppt_final['curso'].pop('course_class', [])

                # filtra a turma correta
                ppt_final['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)
                ppt_final['turma_progressao'] = next((turma for turma in turmas if turma['id'] == turma_progressao_id), None)

                # filtro de busca
                if busca.strip():
                    busca_lower = busca.lower()
                    if any(busca_lower in str(v).lower() for v in ppt_final.values() if v is not None):
                        resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))
                else:
                    resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))

            except Exception as e:
                raise Exception(f"Erro ao buscar dados do PPT {ppt_final['id']}: {str(e)}")
            
            ultimo_valor_cursor = ppt.data_criacao

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)
    
    @staticmethod
    def listar_CRE(request):
        busca = request.GET.get('busca', '')

        paginator = PPTPagintation()
        ultimo_valor_cursor = request.GET.get('cursor')

        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        while len(resultado) < paginator.page_size + 1:
            filtro = {}
            if ultimo_valor_cursor:
                filtro['data_criacao__lt'] = ultimo_valor_cursor

            ppt = (
                PPT.objects
                .filter(**filtro, status__in=['Criada', 'Lançada'])
                .order_by('-data_criacao')
                .first()
            )

            if not ppt:
                break

            ppt_serializado = PPTSerializer(ppt, context={'request': request}).data
            tasks = [
                {"key": "aluno", "url": f"{base_url}/api/users/get/{ppt_serializado['aluno']}/", "params": {"fields": "id,username"}},
                {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_disciplina']}/", "params": {"fields": "id,username"}},
                {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_ppt']}/", "params": {"fields": "id,username"}},
                {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ppt_serializado['curso']}/", "params": {"fields": "id,name, course_class.id, course_class.number"}},
                {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ppt_serializado['disciplina']}/", "params": {"fields": "id,name"}},
            ]

            try:
                dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)
                ppt_final = {**ppt_serializado, **dados_ppt}

                turma_atual_id = ppt_final['turma_atual']
                turma_progressao_id = ppt_final['turma_progressao']
                turmas = ppt_final['curso'].pop('course_class', [])

                # filtra a turma correta
                ppt_final['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)
                ppt_final['turma_progressao'] = next((turma for turma in turmas if turma['id'] == turma_progressao_id), None)

                # filtro de busca
                if busca.strip():
                    busca_lower = busca.lower()
                    if any(busca_lower in str(v).lower() for v in ppt_final.values() if v is not None):
                        resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))
                else:
                    resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))

            except Exception as e:
                raise Exception(f"Erro ao buscar dados do PPT {ppt_final['id']}: {str(e)}")
            
            ultimo_valor_cursor = ppt.data_criacao

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

    @staticmethod
    def listar_coordenador(request):
        coordenador_id = TokenService.decode_token(request.COOKIES.get("access_token")).get("user_id")
        busca = request.GET.get('busca', '')

        paginator = PPTPagintation()
        ultimo_valor_cursor = request.GET.get('cursor')

        resultado = []

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        while len(resultado) < paginator.page_size + 1:
            filtro = {}
            if ultimo_valor_cursor:
                filtro['data_criacao__lt'] = ultimo_valor_cursor

            ppt = (
                PPT.objects
                .filter(**filtro)
                .order_by('-data_criacao')
                .first()
            )

            if not ppt:
                break

            ppt_serializado = PPTSerializer(ppt, context={'request': request}).data
            task_curso = [{
                "key": "curso",
                "url": f"{base_url}/api/academic/courses/get/{ppt_serializado['curso']}/",
                "params": {"fields": "id, name, coord.id, course_class.id, course_class.number"}
            }]

            dados_curso = AsyncRequestService.run_fetch(task_curso, cookies=cookies)
            curso = dados_curso["curso"]

            coord_curso = curso.pop("coord")
            curso_coord_id = coord_curso["id"]  

            if curso_coord_id != str(coordenador_id):
                ultimo_valor_cursor = ppt.data_criacao
                continue

            outras_tasks = [
                {"key": "aluno", "url": f"{base_url}/api/users/get/{ppt_serializado['aluno']}/",
                "params": {"fields": "id,username"}},
                {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_disciplina']}/",
                "params": {"fields": "id,username"}},
                {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{ppt_serializado['professor_ppt']}/",
                "params": {"fields": "id,username"}},
                {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ppt_serializado['disciplina']}/",
                "params": {"fields": "id,name"}},
            ]

            dados_ppt = AsyncRequestService.run_fetch(outras_tasks, cookies=cookies)
            ppt_final = {**ppt_serializado, **dados_ppt, **dados_curso}

            turma_atual_id = ppt_final['turma_atual']
            turma_progressao_id = ppt_final['turma_progressao']
            turmas = ppt_final['curso'].pop('course_class', [])

            ppt_final['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)
            ppt_final['turma_progressao'] = next((turma for turma in turmas if turma['id'] == turma_progressao_id), None)

            if busca.strip():
                busca_lower = busca.lower()
                if any(busca_lower in str(v).lower() for v in ppt_final.values() if v is not None):
                    resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))
            else:
                resultado.append(formatar_obj(ppt_final, request.GET.get("formato")))

            ultimo_valor_cursor = ppt.data_criacao

        page = paginator.paginate_queryset(resultado, request)
        return paginator.get_paginated_response(page)

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
    def trocar_status(ppt_data, ppt_id):
        ppt = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))
        data = ppt_data.copy()

        nota = data.get('nota_final')
        status = data.get('status')

        if status == 'Finalizada' and nota:
            data['data_final'] = datetime.now()
            if len(nota) > 0:
                if float(nota) >= 7.0:
                    data['situacao'] = "Aprovado"
                else:
                    data['situacao'] = "Reprovado"

        if (status == 'Desativada'):
            data['situacao'] = 'Cancelada'

        if status == 'Em Andamento':
            data['data_inicio'] = datetime.now()

        serializer = PPTSerializer(instance=ppt, data=data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()
