import logging
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from dependencias_app.models.conselhoDeClasse import *
from dependencias_app.permissoes import GestaoEscolar
from rest_framework.parsers import MultiPartParser, FormParser
from dependencias_app.serializers.conselhodeClasseSerializer import ConselhodeClasseSerializer



@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_conselhos(request, conselho_id):
    try:
        conselhoDeClasse = ConselhoDeClasse.objects.get(id=conselho_id)  # Buscando o conselho pelo ID
        serializer = ConselhoDeClasse(ConselhoDeClasse, context={'request': request})  # Serializando o conselho encontrado
        
        return Response(serializer.data, status=status.HTTP_200_OK)  # Retorna os dados do conselho em formato JSON com status 200 OK
    except ConselhoDeClasse.DoesNotExist:
        logger.error('Conselho de classe não encontrado: ID %s', conselho_id)
        return Response({'mensagem': 'Conselho de classe não encontrado'}, status=status.HTTP_404_NOT_FOUND)  # Retorna erro 404 caso não encontre
    except Exception as e:
        logger.error('Erro ao obter conselho de classe: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # Retorna erro 500 para qualquer outro tipo de erro 


@api_view(['POST'])
@permission_classes([GestaoEscolar])
def adicionar_conselho(request):
    try:
        conselho = conselho.objects.filter(id=conselho_id).first()
        # Se o PED não for encontrado, retornar erro
        if not conselho:
            return Response({"erro": "Conselho não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ConselhodeClasseSerializer(data=request.data)

        # Verifica se os dados enviados são válidos
        if serializer.is_valid():
            conselho = serializer.save(id=conselho_id)
    except Exception as e:
        # Retorna erro genérico em caso de falha
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_conselho(request, conselho_id):
    try:
        conselho = conselho.objects.filter(id=conselho_id).first()

        conselho.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deletar_conselho(request, conselho_id):
    try:
        conselho = conselho.objects.filter(id=conselho_id).first()

        conselho.delete()
        return Response({'mensagem': 'Conselho de classe removido com sucesso.'}, status=status.HTTP_204_NO_CONTENT)
    except conselho.DoesNotExist:
        return Response({'mensagem': 'Conselho de classe não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

