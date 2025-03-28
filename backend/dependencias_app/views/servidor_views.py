from django.shortcuts import get_object_or_404
from google_auth.models import UsuarioBase
from backend.dependencias_app.serializers.usuario_base_serializer import Usuario_Base_Serializer
from dependencias_app.permissoes import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_servidores(request):
    try:
        # Listando e filtrando os dados
        servidores = UsuarioBase.objects.exclude(grupo__name="Aluno")        

        # Serialização dos dados
        servidores_serializer = Usuario_Base_Serializer(servidores, many=True, context={'request': request})

        return Response(servidores_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def visualizar_servidor(request, idUsuario):
    try:
        servidor = get_object_or_404(UsuarioBase, pk=idUsuario)
        
        servidor_serializer = Usuario_Base_Serializer(servidor)

        return Response(servidor_serializer.data, status=status.HTTP_200_OK)
    except UsuarioBase.DoesNotExist:
        return Response({'mensagem': 'Servidor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def editar_servidor(request, idUsuario):
    try:
        servidor = get_object_or_404(UsuarioBase, pk=idUsuario)

        serializer = Usuario_Base_Serializer(servidor, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
