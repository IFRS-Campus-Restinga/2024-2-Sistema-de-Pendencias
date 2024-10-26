from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from dependencias_app.permissoes import *
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group
from dependencias_app.serializers.eventoCalendarioSerializer import EventoSerializer
from dependencias_app.models.eventoCalendario import Evento
from google_auth.models import UsuarioBase
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_evento(request):
    logger.info('Dados do evento recebidos: %s', request.data)
    try:
        data = request.data
        serializer = EventoSerializer(data=data)

        # Validar dados do serializer
        if not serializer.is_valid():
            logger.error('Erro de validação: %s', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Salvar evento
        serializer.save()
        logger.info('Evento criado com sucesso: %s', serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error('Erro ao criar evento: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)