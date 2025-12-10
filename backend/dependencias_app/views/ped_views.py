from django.http import Http404
from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.ped_service import PEDService
from fs_auth_middleware.decorators import has_permissions
from ..utils.formatar_erros import formatar_erros

@api_view(['POST'])
@has_permissions(['add_pedintegrado', 'add_pedproeja'])
def cadastrar_PED(request, modalidade):
    try:
        PEDService.criar(request.data, modalidade)
        
        return Response({'message': 'PED registrada com sucesso!'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_permissions(['view_pedintegrado', 'view_pedproeja'])
def listar_PED_por_modalidade(request, modalidade):
    try:
        return PEDService.listar(request, modalidade)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_permissions(['view_pedintegrado', 'view_pedproeja'])
def listar_PED_por_professor(request, modalidade):
    try:
        return PEDService.listar_professor(request, modalidade)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_permissions(['view_pedintegrado', 'view_pedproeja'])
def listar_PED_por_coordenador(request, modalidade):
    try:
        return PEDService.listar_coordenador(request, modalidade)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@has_permissions(['view_pedintegrado', 'view_pedproeja'])
def listar_PED_por_aluno(request):
    try:
        return PEDService.listar_aluno(request)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@has_permissions(['view_pedintegrado', 'view_pedproeja'])
def detalhes_PED(request, modalidade, ped_id):
    try:
        return Response(PEDService.detalhes(request, modalidade, ped_id), status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'PATCH'])
@has_permissions(['change_pedintegrado', 'change_pedproeja'])
def editar_PED(request, modalidade, ped_id):
    try:
        PEDService.editar(request.data, modalidade, ped_id)
        return Response({'message': 'PED editada com sucesso'}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PATCH', 'PUT'])
@has_permissions(['change_pedintegrado', 'change_pedproeja'])
def trocar_status_PED(request, modalidade, ped_id):
    try:
        PEDService.trocar_status(request.data, modalidade, ped_id)
        return Response({'message': 'Status da PED alterado com sucesso'}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
