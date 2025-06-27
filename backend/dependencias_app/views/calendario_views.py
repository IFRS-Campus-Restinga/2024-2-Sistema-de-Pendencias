import uuid
from datetime import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.pagination import PageNumberPagination
from dependencias_app.permissoes import *
from dependencias_app.serializers.evento_serializer import Evento_Serializer
from dependencias_app.serializers.calendario_academico_serializer import Calendario_Academico_Serializer
from dependencias_app.models.evento import Evento
from dependencias_app.models.calendario_academico import Calendario_Academico

class CursoPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100 

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_calendarios(request):
    try:
        busca = request.query_params.get('busca', '').strip()
        page_size = request.query_params.get('page_size', 15)

        cursos = Calendario_Academico.objects.all()
        
        if busca:
            cursos = Calendario_Academico.objects.filter(
                Q(titulo__icontains=busca) |
                Q(tipo_calendario__icontains=busca)
            )

        # Paginação
        paginator = CursoPagination()
        paginator.page_size = page_size
        result_page = paginator.paginate_queryset(cursos, request)
        
        serializer = Calendario_Academico_Serializer(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def buscar_por_titulo(request, modalidade, titulo):
    try:
        calendarios = Calendario_Academico.objects.filter(titulo__icontains=titulo, tipo_calendario=modalidade)

        if len(calendarios) == 0:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = Calendario_Academico_Serializer(calendarios, context={'request': request}, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def obter_calendario(request, calendarioId):
    try:
        uuid_calendario = uuid.UUID(calendarioId)

        calendario = get_object_or_404(Calendario_Academico, pk=uuid_calendario)

        serializer = Calendario_Academico_Serializer(calendario)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response(
            {'mensagem': str(e)},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'mensagem': f'Um erro inesperado ocorreu: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_eventos_calendario(request, calendarioId):

    try:
        uuid_calendario = uuid.UUID(calendarioId)

        calendario = get_object_or_404(Calendario_Academico, pk=uuid_calendario)
        serializer_calendario = Calendario_Academico_Serializer(calendario)

        mes = request.query_params.get('mes')
        ano = request.query_params.get('ano')

        if not mes or not ano:
            return Response(
                {'mensagem': 'Os parâmetros "mes" e "ano" são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif mes and ano:
            try:
                mes = int(mes)
                ano = int(ano)
            except ValueError:
                return Response(
                    {'mensagem': 'Mês e ano devem ser valores numéricos'},
                    status=status.HTTP_400_BAD_REQUEST
                )
    
        # Primeiro e último dia do mês
        data_inicio_mes = datetime(ano, mes, 1)

        if mes == 12:
            data_fim_mes = datetime(ano + 1, 1, 1)
        else:
            data_fim_mes = datetime(ano, mes + 1, 1)

        eventos = Evento.objects.filter(
            calendario=calendario
        ).filter(
            Q(data_inicio__lt=data_fim_mes, data_fim__gte=data_inicio_mes) |
            Q(data_inicio__month=mes, data_inicio__year=ano) |
            Q(data_fim__month=mes, data_fim__year=ano)
        ).order_by('data_inicio')

        if not eventos: return Response({'calendario': serializer_calendario.data, 'mensagem': 'Nenhum evento encontrado para este mês'}, status=status.HTTP_200_OK)

        serializer_eventos = Evento_Serializer(eventos, many=True)

        return Response({'calendario': serializer_calendario.data,'eventos': serializer_eventos.data}, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response(
            {'mensagem': str(e)},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'mensagem': f'Um erro inesperado ocorreu: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_evento(request):
    data = request.data
    try:
        print(data)
        uuid_calendario = uuid.UUID(data.get('calendario', None))
        data['calendario'] = uuid_calendario

        serializer_evento = Evento_Serializer(data=data)

        if not serializer_evento.is_valid(): raise serializers.ValidationError(serializer_evento.errors)

        serializer_evento.save()

        return Response({'mensagem': 'Evento cadastrado com sucesso'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        error_details = e.detail
        mensagens = []

        if isinstance(error_details, dict):
            for campo, erros in error_details.items():
                if campo == "non_field_errors":
                    for erro in erros:
                        mensagens.append(str(erro))
                else:
                    for erro in erros:
                        mensagens.append(f"{campo}: {str(erro)}")
        elif isinstance(error_details, list):
            for erro in error_details:
                mensagens.append(str(erro))
        else:
            mensagens.append(str(error_details))

        return Response({'mensagem': mensagens}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def obter_evento(request, eventoId):
    try:
        uuid_evento = uuid.UUID(eventoId)

        evento = get_object_or_404(Evento, pk=uuid_evento)

        serializer = Evento_Serializer(evento, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response(
            {'mensagem': str(e)},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'mensagem': f'Um erro inesperado ocorreu: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_evento(request, eventoId):
    data = request.data

    try:
        uuid_evento = uuid.UUID(eventoId)
        uuid_calendario = uuid.UUID(request.data.get('calendario', None))

        data['calendario'] = uuid_calendario
        evento = get_object_or_404(Evento, pk=uuid_evento)

        serializer = Evento_Serializer(evento, data=data)

        if not serializer.is_valid(): raise serializers.ValidationError(serializer.errors)

        serializer.save()

        return Response({'mensagem': 'Evento atualizado com sucesso'}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        error_details = e.detail
        mensagens = []

        if isinstance(error_details, dict):
            for campo, erros in error_details.items():
                if campo == "non_field_errors":
                    for erro in erros:
                        mensagens.append(str(erro))
                else:
                    for erro in erros:
                        mensagens.append(f"{campo}: {str(erro)}")
        elif isinstance(error_details, list):
            for erro in error_details:
                mensagens.append(str(erro))
        else:
            mensagens.append(str(error_details))

        return Response({'mensagem': mensagens}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)