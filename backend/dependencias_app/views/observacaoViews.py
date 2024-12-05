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
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.utils.error_handler import handle_view_errors
import logging
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionar_observacao(request, ped_id):
    try:
        data = request.data

        # Detecta automaticamente o tipo do PED
        ped = None
        try:
            ped = PED_EMI.objects.get(id=ped_id)
            data['ped_emi'] = ped.id
            data['ped_proeja'] = None
        except PED_EMI.DoesNotExist:
            try:
                ped = PED_ProEJA.objects.get(id=ped_id)
                data['ped_proeja'] = ped.id
                data['ped_emi'] = None
            except PED_ProEJA.DoesNotExist:
                return Response({"mensagem": "PED não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ObservacaoSerializer(data=data)
        if serializer.is_valid():
            observacao = serializer.save()

            # Retorna a observação criada
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
