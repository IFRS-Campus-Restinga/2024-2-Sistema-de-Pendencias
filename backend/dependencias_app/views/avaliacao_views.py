from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from fs_auth_middleware.decorators import *


@api_view(['POST'])
def cadastrar_avaliacoes(request):
    pass

@api_view(['GET'])
def listar_avaliacoes_por_PED(request, ped_id):
    pass


@api_view(['PUT'])
def editar_avaliacoes(request):
    pass