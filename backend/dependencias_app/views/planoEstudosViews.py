from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import *
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudos_Serializer
from dependencias_app.permissoes import *
import logging

logger = logging.getLogger(__name__)

# @api_view(['POST'])
# @permission_classes([GestaoEscolar | Professor])
# def cadastrar_plano_estudos(request, pedId):
#     logger.info('Dados recebidos: %s', request.data)
#     try:
#         data = request.data

#         # Tenta buscar o PED_EMI primeiro; se não encontrar, tenta o PED_ProEJA
#         try:
#             ped = PED_EMI.objects.get(id=pedId)
#         except PED_EMI.DoesNotExist:
#             try:
#                 ped = PED_ProEJA.objects.get(id=pedId)
#             except PED_ProEJA.DoesNotExist:
#                 return Response({'mensagem': 'PED não encontrado'}, status=status.HTTP_404_NOT_FOUND)

#         serializer = PlanoEstudos_Serializer(data=data)

#         if serializer.is_valid():
#             plano_estudo = serializer.save()

#             # Verifica a instância e atribui o plano de estudos ao PED correspondente
#             if isinstance(ped, PED_EMI):
#                 ped.plano_estudos_emi = plano_estudo
#                 ped.save()
#             elif isinstance(ped, PED_ProEJA):
#                 ped.plano_estudos_proeja = plano_estudo
#                 ped.save()

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except Exception as e:
#         logger.error("Erro ao cadastrar Plano de Estudo Dirigido: %s", str(e))
#         return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def cadastrar_plano_estudos(request, pedId):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

        # Tenta buscar o PED_EMI primeiro; se não encontrar, tenta o PED_ProEJA
        try:
            ped = PED_EMI.objects.get(id=pedId)
        except PED_EMI.DoesNotExist:
            try:
                ped = PED_ProEJA.objects.get(id=pedId)
            except PED_ProEJA.DoesNotExist:
                return Response({'mensagem': 'PED não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlanoEstudos_Serializer(data=data)

        if serializer.is_valid():
            plano_estudo = serializer.save()

            # Verifica a instância e atribui o plano de estudos ao PED correspondente
            if isinstance(ped, PED_EMI):
                ped.plano_estudos_emi = plano_estudo
                ped.status = 'Em Andamento'  # Atualiza o status
                ped.save()
            elif isinstance(ped, PED_ProEJA):
                ped.plano_estudos_proeja = plano_estudo
                ped.status = 'Em Andamento'  # Atualiza o status
                ped.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error("Erro ao cadastrar Plano de Estudo Dirigido: %s", str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
