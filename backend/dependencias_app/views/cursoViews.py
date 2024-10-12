from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer

import logging

# Inicializa o logger
logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
def cadastrar_curso(request):
    logger.info('Dados recebidos: %s', request.data)
    serializer = CursoSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    logger.error('Erros de validação: %s', serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def visualizar_cursos(request):
    cursos = Curso.objects.all()
    serializer = CursoSerializer(cursos, many=True)
    return Response(serializer.data)


















# import logging

# logger = logging.getLogger(__name__)

# @csrf_exempt
# @api_view(['POST'])
# def cadastrar_curso(request):
#     logger.info('Dados recebidos: %s', request.data)
#     serializer = CursoSerializer(data=request.data)
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#     logger.error('Erros de validação: %s', serializer.errors)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def visualizar_cursos(request):
#     cursos = Curso.objects.all()
#     serializer = CursoSerializer(cursos, many=True)
#     return Response(serializer.data)


