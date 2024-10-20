from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.aluno import Aluno
from dependencias_app.serializers.alunoSerializer import AlunoSerializer
from django.contrib.auth.models import Group
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def cadastrar_aluno(request):
    logger.info('Dados recebidos: %s', request.data)
    try :
        # extrai o perfil da requisicao e busca um grupo com o nome
        grupo = Group.objects.get(name=request.data.get('perfil', None))

        # valida o grupo 
        if not isinstance(grupo, Group): raise Exception('Perfil Inválido!')
        
        #  adiciona o id do grupo a data e envia para o serializador
        data = request.data
        data['perfil'] = grupo.id
        serializer = AlunoSerializer(data=request.data)
        
        # valida o serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.error_messages}')
            
        serializer.save()
        logger.info('Aluno criado com sucesso: %s', serializer.data)
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)

@api_view(['GET'])
def visualizar_alunos(request):
    alunos = Aluno.objects.all()
    serializer = AlunoSerializer(alunos, many=True)
    return Response(serializer.data)