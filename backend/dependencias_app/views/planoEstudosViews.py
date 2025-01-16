import os
import threading
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import *
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.planoEstudos import *
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.planoEstudosSerializer import *
from dependencias_app.permissoes import *
import logging
from dependencias_app.utils.enviar_email import enviar_email


logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def cadastrar_plano_estudos(request, modalidade):
    try:
        data = request.data

        if modalidade == 'Integrado':
            serializer = PlanoEstudos_EMI_Serializer(data=data)

        elif modalidade == 'ProEJA':
            serializer = PlanoEstudos_ProEJA_Serializer(data=data)
        
        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Aluno])
def detalhes_plano_estudos(request, planoId, modalidade):
    try:
        if modalidade == 'Integrado':
            plano = get_object_or_404(PlanoEstudos_EMI, pk=planoId)

            serializer = PlanoEstudos_EMI_Serializer(plano, context={'request': request})
        elif modalidade == 'ProEJA':
            plano = get_object_or_404(PlanoEstudos_ProEJA, pk=planoId)
            
            serializer = PlanoEstudos_ProEJA_Serializer(plano, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)        
    except Exception as e:
        return Response({'mensagem':str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([GestaoEscolar | Professor])
def editar_plano_estudos(request, planoId, modalidade):
    try:
        data = request.data

        if modalidade == 'Integrado':
            plano = get_object_or_404(PlanoEstudos_EMI, pk=planoId)

            serializer = PlanoEstudos_EMI_Serializer(plano, data=data)
        
        elif modalidade == 'ProEJA':
            plano = get_object_or_404(PlanoEstudos_ProEJA, pk=planoId)

            serializer = PlanoEstudos_ProEJA_Serializer(plano, data=data)

        if serializer.is_valid():
            serializer.save()  # Salva as atualizações no banco de dados
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

