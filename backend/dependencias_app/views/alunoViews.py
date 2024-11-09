from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
# importa permissão com outro nome para não conflitar com o model Aluno
from dependencias_app.permissoes import Aluno as AlunoPermissao
#  importa as outras permissões
from dependencias_app.permissoes import GestaoEscolar, RegistroEscolar, Coordenador, Professor
# importa a classe que permite mais de uma perfil acessar a mesma view
from dependencias_app.permissoes import Or
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.alunoSerializer import AlunoSerializer
from dependencias_app.models.aluno import Aluno
from google_auth.models import UsuarioBase
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_aluno(request):
    logger.info('Dados recebidos: %s', request.data)
    try :
        # extrai o perfil da requisicao e busca um grupo com o nome
        data = request.data

        # valida o grupo 
        grupo = Group.objects.get(name='Aluno')
        print(grupo)
        
        #  adiciona o id do grupo a data e envia para o serializador
        data['grupo'] = grupo.id
        data.pop('perfil', None)  # Remove 'perfil' se existir

        serializer = UsuarioBaseSerializer(data=data)
        # valida o serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.error_messages}')

        serializer.save()
        
        logger.info('Aluno criado com sucesso: %s', serializer.data)
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([GestaoEscolar | AlunoPermissao])  # Ajuste para a permissão adequada
def infos_adicionais_aluno(request):
    usuario_id = request.data.get('usuario', None)

    try:
        # Tenta buscar o aluno pelo ID do usuário
        aluno = Aluno.objects.get(usuario_id=usuario_id)
        # Se encontrado, inicializa o serializer para atualização
        serializer_aluno = AlunoSerializer(aluno, data=request.data, partial=True)
        if serializer_aluno.is_valid():
            serializer_aluno.save()
            return Response(serializer_aluno.data, status=status.HTTP_200_OK)
    except Aluno.DoesNotExist:
        # Se não existir, cria um novo aluno
        serializer_aluno = AlunoSerializer(data=request.data)
        if serializer_aluno.is_valid():
            serializer_aluno.save()
            return Response(serializer_aluno.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_aluno.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'mensagem': 'Erro inesperado.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([GestaoEscolar | AlunoPermissao])
def get_aluno_infos (request, idAluno):
    try:
        aluno = Aluno.objects.get(usuario_id=idAluno)
        serializer_aluno = AlunoSerializer(aluno)

        return Response(data=serializer_aluno.data, status=status.HTTP_200_OK)
    except Aluno.DoesNotExist: return Response(data={}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)   

# @api_view(['GET'])
# def visualizar_alunos(request):
#     alunos = Aluno.objects.all()
#     serializer = AlunoSerializer(alunos, many=True)
#     return Response(serializer.data)