from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import *
from dependencias_app.models.professor import Professor

from dependencias_app.serializers.observacaoSerializer import ObservacaoSerializer
from dependencias_app.models.observacao import Observacao
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([Professor])  # Garantir que apenas professores possam adicionar observações
def adicionar_observacao(request):
    try:
        # Verifica se os dados enviados são válidos
        serializer = ObservacaoSerializer(data=request.data)

        if serializer.is_valid():
            # Salva a observação
            observacao = serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Retorna os erros de validação
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Retorna erro genérico em caso de falha
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
