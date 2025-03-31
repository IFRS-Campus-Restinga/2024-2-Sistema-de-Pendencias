from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.notificacao import Notificacao
from dependencias_app.serializers.notificacao_serializer import Notificacao_Serializer
from dependencias_app.permissoes import *

class NotificacaoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def buscar_notificacoes(request):
    try:
        notificacoes = Notificacao.objects.filter(usuario=request.user, lida=False)
        
        paginator = NotificacaoPagination()
        result_page = paginator.paginate_queryset(notificacoes, request)
        notificacao_serializer = Notificacao_Serializer(result_page, many=True)
        
        return paginator.get_paginated_response(notificacao_serializer.data)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['POST'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def trocar_status(request, idNotificacao):
    try:
        notificacao = get_object_or_404(Notificacao, pk=idNotificacao)

        notificacao.lida = True

        notificacao.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    