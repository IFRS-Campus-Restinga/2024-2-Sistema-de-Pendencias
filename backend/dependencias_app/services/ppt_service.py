import uuid
import aiohttp
import asyncio
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from ..models.ppt import PPT
from ..serializers.ppt_serializer import PPTSerializer
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.formatar_obj import formatar_obj
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

        paginator = PPTPagintaion()

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
    def detalhes(request, ppt_id):
        ppt = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))

        serializer = PPTSerializer(ppt, context={"request": request})

        cookies = {"system": settings.API_KEY}
        base_url = settings.BASE_SYSTEM_URL

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{ppt['aluno']}/", "params": {"fields": "id,username"}},
            {"key": "professor_disciplina", "url": f"{base_url}/api/users/get/{ppt['professor_disciplina']}/", "params": {"fields": "id,username"}},
            {"key": "professor_ppt", "url": f"{base_url}/api/users/get/{ppt['professor_ppt']}/", "params": {"fields": "id,username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{ppt['curso']}/", "params": {"fields": "id,name"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{ppt['disciplina']}/", "params": {"fields": "id,name"}},
        ]

        try:
            # executa todas as requests simultaneamente
            dados_ppt = AsyncRequestService.run_fetch(tasks, cookies=cookies)

            turma_atual_id = ppt['turma_atual']  # id da turma atual que você quer encontrar
            turma_progressao_id = ppt['turma_progressao']
            turmas = ppt['curso'].get('course_class', [])

            # filtra a turma correta
            ppt['turma_atual'] = next((turma for turma in turmas if turma['id'] == turma_atual_id), None)
            ppt['turma_progressao'] = next((turma for turma in turmas if turma['id'] == turma_progressao_id), None)

            ppt_dict = serializer.data.copy()
            ppt_dict.update(dados_ppt)
        except Exception as e:
            raise Exception(f"Erro ao buscar dados do PPT {ppt['id']}: {str(e)}")

        return formatar_obj(ppt_dict, request.GET.get("formato"))

    @staticmethod
    @transaction.atomic
    def editar(ppt_data, ppt_id):
        ped = get_object_or_404(PPT, pk=uuid.UUID(ppt_id))
        CustomUserService.criar_aluno(ppt_data.get('aluno'))

        serializer = PPTSerializer(instance=ped, data=ppt_data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()


class AsyncRequestService:
    @staticmethod
    async def fetch_json(session, url, params=None, cookies=None):
        async with session.get(url, params=params, cookies=cookies, timeout=10) as response:
            response.raise_for_status()
            return await response.json()

    @staticmethod
    async def fetch_multiple(tasks, cookies=None):
        """
        Executa múltiplas requisições simultaneamente.
        tasks: lista de dicts {"key": str, "url": str, "params": dict}
        Retorna dict {key: resultado_json}
        """
        cookies = cookies or {}
        async with aiohttp.ClientSession() as session:
            coros = [
                AsyncRequestService.fetch_json(session, t["url"], params=t.get("params"), cookies=cookies)
                for t in tasks
            ]
            results = await asyncio.gather(*coros, return_exceptions=False)
        
        return {t["key"]: r for t, r in zip(tasks, results)}

    @staticmethod
    def run_fetch(tasks, cookies=None):
        return asyncio.run(AsyncRequestService.fetch_multiple(tasks, cookies=cookies))