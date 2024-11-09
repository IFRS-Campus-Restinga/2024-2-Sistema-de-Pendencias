from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import *
from dependencias_app.serializers.eventoSerializer import EventoSerializer
from dependencias_app.models.evento import Evento
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
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
    

@api_view(['GET'])
def listar_eventos(request):
    try:
        eventos = Evento.objects.all()
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error('Erro ao listar eventos: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def atualizar_evento(request, evento_id):
    try:
        evento = Evento.objects.get(id=evento_id)
        serializer = EventoSerializer(evento, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info('Evento atualizado com sucesso: %s', serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error('Erro de validação na atualização: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Evento.DoesNotExist:
        logger.error('Evento não encontrado para atualização: ID %s', evento_id)
        return Response({'mensagem': 'Evento não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error('Erro ao atualizar evento: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def deletar_evento(request, evento_id):
    try:
        evento = Evento.objects.get(id=evento_id)
        evento.delete()
        logger.info('Evento deletado com sucesso: ID %s', evento_id)
        return Response({'mensagem': 'Evento deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)

    except Evento.DoesNotExist:
        logger.error('Evento não encontrado para exclusão: ID %s', evento_id)
        return Response({'mensagem': 'Evento não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error('Erro ao deletar evento: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
