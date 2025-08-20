from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.ped_service import PEDService

@api_view(['POST'])
def cadastrar_PED(request, modalidade):
    try:
        PEDService.criar(request.data, modalidade)
        
        return Response({'message': 'PED registrada com sucesso!'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def listar_PED_por_modalidade(request, modalidade):
    try:
        return PEDService.listar(request, modalidade)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def detalhes_PED(request, pedId, modalidade):
    pass

@api_view(['PUT', 'PATCH'])
def editar_PED(request, modalidade, pedId):
    pass
    

@api_view(['PUT'])
def desativar_PED(request, modalidade, pedId):
    pass
