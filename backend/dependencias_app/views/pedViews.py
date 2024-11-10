from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.professor import Professor
from dependencias_app.serializers.pedEMISerializer import PED_EMISerializer
from dependencias_app.serializers.pedPROEJASerializer import PED_ProEJASerializer
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_EMI(request):
    try:
        data = request.data

        data.pop('anoSemestreReprov', None)

        print(data)

        serializer = PED_EMISerializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_ProEJA(request):
    try:
        data = request.data

        data.pop('turmaOrigem', None)
        data.pop('serieAnoProgressao', None)
        data.pop('trimestreRec', None)

        print(data)

        serializer = PED_ProEJASerializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
