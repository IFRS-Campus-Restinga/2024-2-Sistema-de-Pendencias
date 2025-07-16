from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers, status
from fs_auth_middleware.decorators import has_every_permission, has_any_permission
from dependencias_app.services.grupo_service import GrupoService
from django.http import Http404

@api_view(['POST'])
@has_every_permission(['add_group'])
def cadastrar_grupo(request):
    try:
        GrupoService.criar(request.data)

        return Response({'mensagem': 'Grupo registrado com sucesso'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_every_permission(['view_group'])
def listar_grupos(request):
    try:
        return GrupoService.listar(request)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_every_permission(['view_group'])
def detalhes_grupo(request, grupo_id):
    try:
        grupo = GrupoService.detalhes(request, grupo_id)

        return Response(grupo, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT', 'PATCH'])
@has_every_permission(['change_group'])
def editar_grupo(request):
    try:
        GrupoService.editar(request.data)

        return Response({'mensagem': 'Grupo editado com sucesso'}, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)