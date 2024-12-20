from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.pptSerializer import *
from dependencias_app.models.ppt import PPT
from dependencias_app.permissoes import GestaoEscolar, RegistroEscolar
from django.shortcuts import *
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_ppt(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

        serializer = PPTSerializer(data=data)
        
        if serializer.is_valid(raise_exception=True):
            # Salvar o novo objeto PPT
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_ppt(request):
    try:
        lista_ppt = PPT.objects.all()

        serializer = PPTSerializer(lista_ppt, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem: ', str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([RegistroEscolar])
def listar_ppt_registro(request):
    try:
        lista_ppt = PPT.objects.all()

        serializer = PPTSerializer(lista_ppt, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem: ', str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_ppt_id(request, idPpt):
    try:
        ppt = PPT.objects.get(id=idPpt)

        serializer = PPTSerializer(ppt)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem: ', str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_ppt(request, idPpt):
    logger.info('Dados recebidos para edição: %s', request.data)
    try:
        # Buscar o objeto PPT pelo ID
        ppt = PPT.objects.get(id=idPpt)
        
        # Criar o serializer com os dados recebidos para atualização
        serializer = PPTSerializer(ppt, data=request.data)

        # Verificar se os dados são válidos
        if serializer.is_valid():
            # Salvar as alterações no banco de dados
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Caso o serializer não seja válido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except PPT.DoesNotExist:
        return Response({'mensagem': 'PPT não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def desativar_ppt(request, idPpt):
    logger.info('ID recebido para desativar: %s', idPpt)
    try:
        # Buscar o objeto PPT pelo ID
        ppt = PPT.objects.get(id=idPpt)

        serializer = PPTSerializer(ppt)

        # Verificar se os dados são válidos
        if serializer:
            serializer.set_status(ppt, 'Desativado')
            return Response(True, status=status.HTTP_200_OK)
        
        # Caso o serializer não seja válido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except PPT.DoesNotExist:
        return Response({'mensagem': 'PPT não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([RegistroEscolar])
def ppt_em_andamento(request, idPpt):
    logger.info('ID recebido para desativar: %s', idPpt)
    try:
        # Buscar o objeto PPT pelo ID
        ppt = PPT.objects.get(id=idPpt)

        serializer = PPTSerializer(ppt)

        # Verificar se os dados são válidos
        if serializer:
            serializer.set_status(ppt, 'Em Andamento')
            return Response(True, status=status.HTTP_200_OK)
        
        # Caso o serializer não seja válido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except PPT.DoesNotExist:
        return Response({'mensagem': 'PPT não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
