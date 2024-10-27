from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import *
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group
from dependencias_app.serializers.alunoSerializer import AlunoSerializer
from google_auth.models import UsuarioBase
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
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
@permission_classes([Aluno])  # Ajuste para a permissão adequada
def infos_adicionais_aluno(request):
    try:
        # Obter o ID do usuário enviado na requisição
        usuario_id = request.data.get('usuario', None)
        usuario = UsuarioBase.objects.get(pk=usuario_id)  # Busca o aluno pelo ID do usuário

        # Atualizar os dados do aluno
        serializer_aluno = AlunoSerializer(data=request.data)

        if serializer_aluno.is_valid():
            serializer_aluno.save()
            return Response(serializer_aluno.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer_aluno.errors)  # Adicione esta linha para depuração
            raise Exception(serializer_aluno.errors)  # Levanta um erro se a validação falhar

    except usuario.DoesNotExist:
        return Response({'mensagem': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def visualizar_alunos(request):
#     alunos = Aluno.objects.all()
#     serializer = AlunoSerializer(alunos, many=True)
#     return Response(serializer.data)