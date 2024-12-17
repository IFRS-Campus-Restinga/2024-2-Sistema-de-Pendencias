from rest_framework.decorators import permission_classes
from dependencias_app.permissoes import GestaoEscolar
from dependencias_app.models.conselhoDeClasse import ConselhoDeClasse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes


@api_view(['GET'])
@permission_classes([GestaoEscolar])    
def obter_conselho_de_classe(request, id):
    """
    Obtem um conselho de classe pelo id
    """
    try:
        conselho_de_classe = ConselhoDeClasse.objects.get(pk=id)
        
        serializer = ConselhoDeClasseSerializer(conselho_de_classe, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_conselho_de_classe(request):
    """
    Lista todos os conselhos de classe cadastrados
    """
    try:
        conselho_de_classe = ConselhoDeClasse.objects.all()
        
        serializer = ConselhoDeClasseSerializer(conselho_de_classe, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def criar_conselho_de_classe(request):
    """
    Cria um novo conselho de classe
    """
    try:
        serializer = ConselhoDeClasseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_conselho_de_classe(request, id):
    """
    Edita um conselho de classe
    """
    try:        
        conselho_de_classe = ConselhoDeClasse.objects.get(pk=id)
        serializer = ConselhoDeClasseSerializer(conselho_de_classe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ConselhoDeClasse.DoesNotExist:
        return Response({'mensagem': 'Conselho de classe nao encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([GestaoEscolar])
def deletar_conselho_de_classe(request, id):
    """
    Deleta um conselho de classe
    """
    try:
        conselho_de_classe = ConselhoDeClasse.objects.get(pk=id)
        conselho_de_classe.delete()
        return Response({'mensagem': 'Conselho de classe deletado com sucesso'}, status=status.HTTP_200_OK)
    except ConselhoDeClasse.DoesNotExist:
        return Response({'mensagem': 'Conselho de classe nao encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)