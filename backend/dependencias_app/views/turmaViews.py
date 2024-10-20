from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.serializers.turmaSerializer import TurmaSerializer 
from dependencias_app.models.turma import Turma
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@api_view(['POST'])
def cadastrar_turma(request):
     logger.info('Dados recebidos para cadastro de turma: %s', request.data)
     serializer = TurmaSerializer(data=request.data)
    
     if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
     logger.error('Erros de validação na turma: %s', serializer.errors)
     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def listar_turmas(request):
    curso_id = request.query_params.get('curso_id')  # Pega o parâmetro curso_id da URL
    if curso_id:
        # Filtra as turmas pelo curso_id fornecido
        turmas = Turma.objects.filter(curso_id=curso_id)
    else:
        # Se não houver curso_id, retorna todas as turmas
        turmas = Turma.objects.all()
        
    serializer = TurmaSerializer(turmas, many=True)
    return Response(serializer.data)

