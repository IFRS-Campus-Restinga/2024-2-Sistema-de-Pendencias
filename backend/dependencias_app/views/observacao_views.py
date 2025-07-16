from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def cadastrar_observacao(request):
    pass


@api_view(['GET'])
def listar_observacoes(request, ped_id):
    pass


@api_view(['GET'])
def visualizar_observacao(request, observacao_id):
    pass
    

@api_view(['PUT'])
def editar_observacao(request, observacao_id):
    pass