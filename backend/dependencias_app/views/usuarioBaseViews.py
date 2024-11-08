from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.permissoes import *
from google_auth.models import UsuarioBase
from django.shortcuts import get_object_or_404
from django.db.models import Q

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def get_infos_usuario (request, idUsuario):
    try:        
        usuario = get_object_or_404(UsuarioBase, pk=int(idUsuario))

        serializer = UsuarioBaseSerializer(usuario)

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar])
def listar_por_parametro(request, param, grupo):
    try:
        usuarios = UsuarioBase.objects.filter(
            Q(email__icontains=param, grupo__name=grupo) | Q(nome__icontains=param, grupo__name=grupo)
        )

        serializer = UsuarioBaseSerializer(usuarios, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
