from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.cursoSerializer import CursoSerializer
import logging

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



# @api_view(['POST'])
# def cadastrar_curso(request):
#     nome = request.data.get('nome')
#     carga_horaria = request.data.get('carga_horaria')
#     modalidade = request.data.get('modalidade')
    
#     if not nome or not carga_horaria or not modalidade:
#         return Response({'message': 'Dados inválidos'}, status=400)
    
#     curso = Curso.objects.create(nome=nome, carga_horaria=carga_horaria, modalidade=modalidade)
#     return Response({'message': 'Curso cadastrado com sucesso', 'curso_id': curso.id}, status=201)