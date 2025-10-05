from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from ..services.usuario_service import CustomUserService
from ..utils.formatar_erros import formatar_erros
from fs_auth_middleware.decorators import has_permissions


@api_view(['POST'])
@has_permissions(['add_customuser', 'view_group'])
def cadastrar_usuario(request):
    try:
        CustomUserService.criar(request.data)

        return Response({'message': 'Usuário cadastrado com sucesso'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': "Ocorreu um erro"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_customuser', 'view_group'])
def listar_usuarios_perfil(request, perfil):
    try:
        return CustomUserService.listar_perfil(request, perfil) 
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@has_permissions(['view_customuser'])
def listar_usuarios_grupo(request, grupo):
    try:
        return CustomUserService.listar_grupo(request, grupo)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_customuser', 'view_group'])
def detalhes_usuario(request, usuario_id):
    try:
        usuario = CustomUserService.detalhes(usuario_id)

        return Response(usuario, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)    
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': "Ocorreu um erro"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
@has_permissions(['change_customuser', 'view_group'])
def editar_usuario(request, usuario_id):
    try:
        CustomUserService.editar(request.data, usuario_id)

        return Response({'message': 'Usuário editado com sucesso'}, status=status.HTTP_201_CREATED)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': "Ocorreu um erro"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)