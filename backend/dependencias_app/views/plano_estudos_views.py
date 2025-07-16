from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def cadastrar_plano_estudos(request, modalidade):
    pass

@api_view(['GET'])
def detalhes_plano_estudos(request, planoId, modalidade):
    pass

@api_view(['PUT'])
def editar_plano_estudos(request, planoId, modalidade):
    pass