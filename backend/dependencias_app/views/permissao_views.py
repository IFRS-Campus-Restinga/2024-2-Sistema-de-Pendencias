from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers, status
from fs_auth_middleware.decorators import has_permissions
from dependencias_app.services.permissao_service import PermissaoService
from django.http import Http404
    
@api_view(['GET'])
@has_permissions(['view_permission'])
def listar_permissoes(request):
    try:
        return PermissaoService.listar(request)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_permissions(['view_permission'])
def listar_por_grupo(request, grupo_id):
    try:
        return PermissaoService.listar_por_grupo(request, grupo_id)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@has_permissions(['view_group', 'view_permission'])
def listar_nao_vinculadas(request, grupo_id):
    try:
        return PermissaoService.listar_nao_vinculadas(request, grupo_id)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)