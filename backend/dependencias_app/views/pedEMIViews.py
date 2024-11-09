from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.professor import Professor
from dependencias_app.serializers import PED_EMISerializer
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_emiped(request):
    try:
        data = request.data
        
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
