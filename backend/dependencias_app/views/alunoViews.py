from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.permissoes import *
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group, User
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([GestaoEscolar])
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
        serializer = UsuarioBaseSerializer(data=request.data)
        
        # valida o serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.error_messages}')
        
        User.objects.create(email=request.data.get('email', None), grupo=grupo)
        serializer.save()
        logger.info('Aluno criado com sucesso: %s', serializer.data)
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)

# @api_view(['GET'])
# def visualizar_alunos(request):
#     alunos = Aluno.objects.all()
#     serializer = AlunoSerializer(alunos, many=True)
#     return Response(serializer.data)