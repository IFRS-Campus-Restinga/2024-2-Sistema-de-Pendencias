from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from fs_auth_middleware.decorators import *


@api_view(['POST'])
def cadastrar_atividade(request, modalidade):
    pass

@api_view(['GET'])
def listar_atividades(request):
    pass

@api_view(['GET'])
def buscar_atividade_por_id(request, modalidade, atividadeId):
    pass

@api_view(['PUT'])
def editar_atividade(request, modalidade, atividadeId):
    pass