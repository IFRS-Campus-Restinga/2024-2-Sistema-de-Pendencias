from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def cadastrar_acompanhamento(request):
    pass


@api_view(['GET'])
def listar_acompanhamentos(request, ped_id):
    pass


@api_view(['GET'])
def visualizar_acompanhamento(request, acompanhamento_id):
    pass
    

@api_view(['PUT'])
def editar_acompanhamento(request, observacao_id):
    pass