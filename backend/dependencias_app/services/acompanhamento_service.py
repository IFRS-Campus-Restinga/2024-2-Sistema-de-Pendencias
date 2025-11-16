import uuid
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from ..utils.validar_modalidade import validar_modalidade
from dependencias_session.services.token_service import TokenService
from django.db.models import OuterRef, Subquery, UUIDField
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProeja


class AcompanhamentoPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 30


class AcessoException(Exception):
    pass


class AcompanhamentoService:
    @staticmethod
    def validar_acesso(request, modalidade, ped_id):
        ped_model_class, _ = validar_modalidade(modalidade, 'PED')

        payload = TokenService.decode_token(request.COOKIES.get('access_token'))

        # --- subquery responsável atual ---
        if modalidade == "Integrado":
            responsavel_subquery = ProfessorProgressaoIntegrado.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True
            ).values('professor')[:1]
        else:
            responsavel_subquery = ProfessorProgressaoProeja.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True
            ).values('professor')[:1]

        # --- recuperar o PED com anotação ---
        ped = ped_model_class.objects.annotate(
            professor_ped=Subquery(responsavel_subquery, output_field=UUIDField())
        ).get(id=uuid.UUID(ped_id))

        # --- validação professor ---
        if payload['group'] == 'professor':
            if payload['user_id'] != str(ped.professor_ped):
                raise AcessoException('Acesso não autorizado')

        # --- validação coordenação ---
        if payload['group'] == 'coord':
            res = requests.get(
                f"{settings.BASE_SYSTEM_URL}/api/academic/courses/get/{ped.curso}/",
                params={"fields": "coord"},
                cookies={'system': settings.API_KEY}
            ).json()

            coord_id = res.get("data", {}).get("coord")

            if payload['user_id'] != str(coord_id):
                raise AcessoException('Acesso não autorizado')

        return payload

    @staticmethod
    def criar(request, modalidade):
        _, serializer_class = validar_modalidade(modalidade, 'Acompanhamento')

        ped_id = request.data.get("ped")
        payload = AcompanhamentoService.validar_acesso(request, modalidade, ped_id)

        data = request.data.copy()
        data["autor"] = str(payload['user_id'])

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()

    @staticmethod
    def listar(request, modalidade, ped_id):
        model_class, serializer_class = validar_modalidade(modalidade, 'Acompanhamento')

        # agora ped_id é usado corretamente para validar acesso
        AcompanhamentoService.validar_acesso(request, modalidade, ped_id)

        paginator = AcompanhamentoPagination()

        acompanhamentos = model_class.objects.filter(
            ped__id=uuid.UUID(ped_id)
        ).order_by('-data_criacao')

        page = paginator.paginate_queryset(acompanhamentos, request)

        if page is None:
            return paginator.get_paginated_response([])

        serializer = serializer_class(page, many=True, context={'request': request})

        for item in serializer.data:
            item['autor'] = requests.get(
                    f"{settings.BASE_SYSTEM_URL}/api/users/get/{str(item['autor'])}/",
                    params={"fields": "id, username"},
                    cookies={'system': settings.API_KEY}
                ).json()
        
        return paginator.get_paginated_response(serializer.data)

    @staticmethod
    def editar(request, modalidade, acompanhamento_id):
        model_class, serializer_class = validar_modalidade(modalidade, 'Acompanhamento')
        data = request.data.copy()

        acompanhamento = get_object_or_404(model_class, pk=uuid.UUID(acompanhamento_id))

        # usa ped_id do acompanhamento
        ped_id = str(acompanhamento.ped.id)
        payload = AcompanhamentoService.validar_acesso(request, modalidade, ped_id)

        if payload['user_id'] != str(acompanhamento.autor.id):
            raise AcessoException('Acesso não autorizado')
        
        data['autor'] = payload['user_id']

        serializer = serializer_class(instance=acompanhamento, data=request.data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()
