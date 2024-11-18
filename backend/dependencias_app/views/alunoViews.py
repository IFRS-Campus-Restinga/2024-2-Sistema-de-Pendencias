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
        
        #  adiciona o id do grupo a data e envia para o serializador
        data['grupo'] = grupo.id
        data.pop('perfil', None)  # Remove 'perfil' se existir

        serializer = UsuarioBaseSerializer(data=data)
        # valida o serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.errors}')

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

@api_view(['GET'])
@permission_classes([GestaoEscolar]) 
def listar_alunos(request):
    try:
        # Filtros adicionais
        filtro_geral = request.GET.get('filtroGeral', None)
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)

        # Listando todos os alunos
        alunos = UsuarioBase.objects.filter(grupo__name="Aluno")

        # Filtro geral para nome, matrícula, CPF, e-mail
        if filtro_geral:
            alunos = alunos.filter(
                Q(nome__icontains=filtro_geral) |
                Q(aluno__matricula__icontains=filtro_geral) |
                Q(aluno__cpf__icontains=filtro_geral) |
                Q(email__icontains=filtro_geral)
            )

        # Filtro por intervalo de data
        if data_inicio and data_fim:
            alunos = alunos.filter(data_ingresso__range=(data_inicio, data_fim))

        # Ordenação dos resultados
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['nome', 'email', 'matricula']:
            alunos = alunos.order_by(ordenar_por)

        # Serialização dos dados
        alunos_serializer = UsuarioBaseSerializer(alunos, many=True)

        return Response(alunos_serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
