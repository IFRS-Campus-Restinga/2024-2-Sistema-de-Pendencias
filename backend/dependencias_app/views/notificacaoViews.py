from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.models.notificacao import Notificacao
from dependencias_app.serializers.notificacaoSerializer import NotificacaoSerializer
from dependencias_app.permissoes import *

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def buscar_notificacoes(request, idUsuario):
    try:
        notificacoes = Notificacao.objects.filter(usuario=idUsuario).filter(lida=False)

        notificacao_serializer = NotificacaoSerializer(notificacoes, many=True)

        return Response(notificacao_serializer.data, status=status.HTTP_200_OK)
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
    