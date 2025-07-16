from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def cadastrar_PED(request, modalidade):
    pass
    
@api_view(['GET'])
def listar_PED_por_modalidade(request, modalidade):
    pass

@api_view(['GET'])
def detalhes_PED(request, pedId, modalidade):
    pass

@api_view(['PUT', 'PATCH'])
def editar_PED(request, modalidade, pedId):
    pass
    

@api_view(['PUT'])
def desativar_PED(request, modalidade, pedId):
    pass
