import uuid
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from dependencias_app.services.acesso_service import AcessoException, AcessoService
from ..utils.validar_modalidade import validar_modalidade

class AcompanhamentoPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 30


class AcompanhamentoService:
    @staticmethod
    def criar(request, modalidade):
        _, serializer_class = validar_modalidade(modalidade, 'Acompanhamento')

        ped_id = request.data.get("ped")
        payload, _ = AcessoService.validar_acesso(request, modalidade, ped_id)

        data = request.data.copy()
        data["autor"] = str(payload['user_id'])

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()

    @staticmethod
    def listar(request, modalidade, ped_id):
        model_class, serializer_class = validar_modalidade(modalidade, 'Acompanhamento')

        _, ped = AcessoService.validar_acesso(request, modalidade, ped_id)

        paginator = AcompanhamentoPagination()

        acompanhamentos = model_class.objects.filter(
            ped=ped
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

        payload, _ = AcessoService.validar_acesso(request, modalidade, str(acompanhamento.ped.id))

        if payload['user_id'] != str(acompanhamento.autor.id):
            raise AcessoException('Acesso não autorizado')
        
        data['autor'] = payload['user_id']

        serializer = serializer_class(instance=acompanhamento, data=request.data, partial=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()
