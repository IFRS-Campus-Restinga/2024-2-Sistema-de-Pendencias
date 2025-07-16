from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def cadastrar_PPT(request):
    pass

@api_view(['GET'])
def listar_PPT(request):
    pass

@api_view(['GET'])
def detalhes_PPT(request, pptId):
    pass

@api_view(['PUT'])
def editar_ppt(request, PptId):
    pass