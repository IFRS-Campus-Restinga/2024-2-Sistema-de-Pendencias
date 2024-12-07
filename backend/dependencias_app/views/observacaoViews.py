from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import *
from dependencias_app.permissoes import *
from dependencias_app.models.professor import Professor
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.observacaoSerializer import ObservacaoSerializer
from dependencias_app.models.observacao import Observacao
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionar_observacao(request):
    try:
        data = request.data
        
        ped_id = data.get('ped_id')  # Obtém o ped_id do corpo da requisição (se existir)
        
        # Se o ped_id for fornecido, tentamos buscar o PED
        if ped_id:
            ped = None
            try:
                ped = PED_ProEJA.objects.get(id=ped_id)
                data['ped_proeja'] = ped.id
                data['ped_emi'] = None
            except PED_ProEJA.DoesNotExist:
                try:
                    ped = PED_EMI.objects.get(id=ped_id)
                    data['ped_emi'] = ped.id
                    data['ped_proeja'] = None
                except PED_EMI.DoesNotExist:
                    return Response({"mensagem": "PED não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Serializa os dados e tenta salvar a observação
        serializer = ObservacaoSerializer(data=data)
        
        if serializer.is_valid():
            observacao = serializer.save()

            # Retorna a observação criada
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        # Caso algum erro inesperado ocorra, retornamos o erro
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def listar_observacoes(request):
    try:
        observacoes = Observacao.objects.all()
        serializer = ObservacaoSerializer(observacoes, many=True)
        return Response(serializer.data)  # Certifique-se de usar Response aqui
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    
@api_view(['GET'])
def visualizar_observacao(request, id):
    try:
        observacao = Observacao.objects.get(pk=id)
        observacao_serializer = ObservacaoSerializer(observacao)
        return Response(observacao_serializer.data, status=status.HTTP_200_OK)
    except Observacao.DoesNotExist:
        return Response({'mensagem': 'Observação não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)    