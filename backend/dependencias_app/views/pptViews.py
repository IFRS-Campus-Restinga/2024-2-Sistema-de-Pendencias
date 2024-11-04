from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.pptSerializer import PPTSerializer
from dependencias_app.models.ppt import PPT
from dependencias_app.permissoes import GestaoEscolar
from google_auth.models import UsuarioBase
from django.shortcuts import *
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_ppt(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data
        print(data)

        aluno = get_object_or_404(UsuarioBase, email=request.data.get('aluno', None), grupo__name='Aluno')
        professor = get_object_or_404(UsuarioBase, email=request.data.get('professor', None), grupo__name='Professor')

        data['aluno'] = aluno.id
        data['professor'] = professor.id

        serializer = PPTSerializer(data=data)
        
        if serializer.is_valid():
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
        lista_ppt = get_list_or_404(PPT)

        serializer = PPTSerializer(lista_ppt, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem: ', str(e)}, status=status.HTTP_400_BAD_REQUEST)