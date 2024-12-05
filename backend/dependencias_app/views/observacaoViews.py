from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import *
from dependencias_app.models.professor import Professor
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.observacaoSerializer import ObservacaoSerializer
from dependencias_app.models.observacao import Observacao
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group

import logging

logger = logging.getLogger(__name__)

from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import *
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.utils.error_handler import handle_view_errors
import logging
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([Professor]) 
def adicionar_observacao(request, ped_tipo, ped_id):
    try:
        print(f"Dados recebidos: {request.data}")

        # Busca o PED (emi ou proeja)
        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Log do PED encontrado
        print(f"PED encontrado: {ped}")

        if not ped:
            return Response({"erro": "PED não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Validação do serializer
        serializer_observacao = ObservacaoSerializer(data=request.data, context={'request': request})
        if serializer_observacao.is_valid():
            observacao = serializer_observacao.save(ped_emi=ped if ped_tipo == 'emi' else None, ped_proeja=ped if ped_tipo == 'proeja' else None)
            print("Observação criada com sucesso:", observacao)
            return Response(serializer_observacao.data, status=status.HTTP_201_CREATED)
        else:
            print("Erros de validação:", serializer_observacao.errors)
            return Response(serializer_observacao.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("Erro ao criar observação:", str(e))
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)