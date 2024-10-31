from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.permissoes import *
from google_auth.models import UsuarioBase
from django.shortcuts import get_object_or_404


@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def get_infos_usuario (request, idUsuario):
    try:        
        usuario = get_object_or_404(UsuarioBase, pk=int(idUsuario))

        print(usuario)

        serializer = UsuarioBaseSerializer(usuario)

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
