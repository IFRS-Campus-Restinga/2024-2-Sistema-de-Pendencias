from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import *
from dependencias_app.serializers.eventoSerializer import EventoSerializer
from dependencias_app.serializers.calendarioAcademicoSerializer import CalendarioAcademicoSerializer
from dependencias_app.models.evento import Evento
from dependencias_app.models.calendarioAcademico import CalendarioAcademico
import logging
from datetime import datetime
from django.utils.timezone import make_aware


logger = logging.getLogger(__name__)

@api_view(['POST'])
def cadastrar_evento(request):
    logger.info('Dados do evento recebidos: %s', request.data)
    try:
        data = request.data

        # Converter datas para objetos datetime com timezone (se necessário)
        data_inicio = make_aware(datetime.fromisoformat(data.get("data_inicio")))
        data_fim = make_aware(datetime.fromisoformat(data.get("data_fim")))

        # Verificar se existe um calendário acadêmico para o período
        if not CalendarioAcademico.objects.filter(
            data_inicio__lte=data_inicio,
            data_fim__gte=data_fim,
            tipo_calendario=data.get("tipo_calendario")
        ).exists():
            return Response(
                {"mensagem": "Não existe um calendário acadêmico para este período."},
                status=status.HTTP_400_BAD_REQUEST
            )

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

@api_view(['GET'])
def obter_evento(request, evento_id):
    try:
        evento = Evento.objects.get(id=evento_id)
        serializer = EventoSerializer(evento)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Evento.DoesNotExist:
        logger.error('Evento não encontrado: ID %s', evento_id)
        return Response({'mensagem': 'Evento não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error('Erro ao obter evento: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Métodos para relação de criação de pacotes de eventos para calendarios academicos especificos

@api_view(['POST'])
def cadastrar_calendario_academico(request):
    """
    CADASTRA UM NOVO PACOTE DE EVENTOS COM BASE NOS DADOS FORNECIDOS
    """
    serializer = CalendarioAcademicoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_calendarios_academicos(request):
    """
    LISTA TODOS OS PACOTES DE EVENTOS CADASTRADOS
    """
    calendariosAcademicos = CalendarioAcademico.objects.all()
    serializer = CalendarioAcademicoSerializer(calendariosAcademicos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def listar_eventos_do_calendario_academico(request, id_pacote):
    """
    LISTA TODOS OS EVENTOS DENTRO DO INTERVALO DE UM PACOTE ESPECÍFICO
    """
    try:
        pacote = CalendarioAcademico.objects.get(id=id_pacote)
        eventos = Evento.objects.filter(
            data_inicio__gte=pacote.data_inicio,
            data_fim__lte=pacote.data_fim,
            tipo_calendario=pacote.tipo_calendario
        )
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CalendarioAcademico.DoesNotExist:
        return Response({"mensagem": "Pacote não encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def atualizar_calendario_academico(request, id_calendario):
    try:
        calendario = CalendarioAcademico.objects.get(id=id_calendario)

        # Converter datas do request para objetos datetime
        novo_inicio = request.data.get("data_inicio")
        novo_fim = request.data.get("data_fim")

        if novo_inicio and novo_fim:
            novo_inicio = make_aware(datetime.fromisoformat(novo_inicio))
            novo_fim = make_aware(datetime.fromisoformat(novo_fim))
        else:
            return Response(
                {"mensagem": "Datas inválidas ou ausentes."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar se o período foi reduzido
        if novo_inicio > calendario.data_inicio or novo_fim < calendario.data_fim:
            # Identificar eventos fora do novo intervalo
            eventos_fora = Evento.objects.filter(
                tipo_calendario=calendario.tipo_calendario
            ).filter(
                data_inicio__lt=novo_inicio
            ) | Evento.objects.filter(
                tipo_calendario=calendario.tipo_calendario,
                data_fim__gt=novo_fim
            )

            if eventos_fora.exists():
                # Retornar os eventos conflitantes
                eventos_detalhes = [
                    {"id": evento.id, "titulo": evento.titulo, "data_inicio": evento.data_inicio,
                     "data_fim": evento.data_fim}
                    for evento in eventos_fora
                ]
                logger.error('Existem eventos fora do novo intervalo do período letivo.')
                return Response(
                    {
                        "mensagem": "Existem eventos fora do novo intervalo do período letivo.",
                        "eventos_conflitantes": eventos_detalhes
                    },
                    status=status.HTTP_409_CONFLICT
                )

        # Atualizar o calendário acadêmico
        serializer = CalendarioAcademicoSerializer(calendario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info('Calendário acadêmico atualizado com sucesso: %s', serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        logger.error('Erro de validação na atualização do calendário acadêmico: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except CalendarioAcademico.DoesNotExist:
        logger.error('Calendário acadêmico não encontrado para atualização: ID %s', id_calendario)
        return Response({'mensagem': 'Calendário acadêmico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error('Erro ao atualizar calendário acadêmico: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obter_calendario_academico(request, id_calendario):
    try:
        calendario = CalendarioAcademico.objects.get(id=id_calendario)
        serializer = CalendarioAcademicoSerializer(calendario)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CalendarioAcademico.DoesNotExist:
        logger.error('Calendário acadêmico não encontrado: ID %s', id_calendario)
        return Response({'mensagem': 'Calendário acadêmico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error('Erro ao obter calendário acadêmico: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

