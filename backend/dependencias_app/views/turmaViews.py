from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.serializers.turmaSerializer import TurmaSerializer 
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

