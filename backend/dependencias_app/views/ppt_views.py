from django.http import Http404
from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.ppt_service import PPTService
from fs_auth_middleware.decorators import has_permissions
from ..utils.formatar_erros import formatar_erros

@api_view(['POST'])
@has_permissions(['add_ppt'])
def cadastrar_PPT(request):
    try:
        PPTService.criar(request.data)
        return Response({'message': "PPT cadastrada com sucesso"}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@has_permissions(['view_ppt'])
def listar_PPT(request):
    try:
        return PPTService.listar(request)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_ppt'])
def detalhes_PPT(request, ppt_id):
    try:
        return Response(PPTService.detalhes(request, ppt_id), status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@has_permissions(['change'])
def desativar_PPT(request, ppt_id):
    pass