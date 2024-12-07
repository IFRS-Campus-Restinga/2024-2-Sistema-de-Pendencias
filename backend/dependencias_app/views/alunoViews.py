from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.permissoes import Aluno as AlunoPermissao
from dependencias_app.permissoes import GestaoEscolar, RegistroEscolar, Coordenador, Professor, Aluno
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.alunoSerializer import AlunoSerializer
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.models.ppt import PPT
from dependencias_app.serializers.pedEMISerializer import PED_EMI_Serializer
from dependencias_app.serializers.pedProEJASerializer import PED_ProEJA_Serializer
from dependencias_app.serializers.pptSerializer import PPTSerializer
from google_auth.models import UsuarioBase
from django.contrib.auth.models import Group
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

        # Serialização dos dados
        alunos_serializer = UsuarioBaseSerializer(alunos, many=True, context={'request': request})

        return Response(alunos_serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AlunoPermissao])
def listar_dependencias_aluno(request):
    try:
        aluno = request.user

        peds_emi = PED_EMI.objects.filter(aluno=aluno).order_by('-data_criacao')
        peds_proeja = PED_ProEJA.objects.filter(aluno=aluno).order_by('-data_criacao')
        ppts = PPT.objects.filter(aluno=aluno).order_by('-data_criacao')

        peds_emi_serializer = PED_EMI_Serializer(peds_emi, many=True, context={"request": request})
        peds_proeja_serializer = PED_ProEJA_Serializer(peds_proeja, many=True, context={"request": request})
        ppts_serializer = PPTSerializer(ppts, many=True, context={'request': request})

        dependencias = (peds_emi_serializer.data + peds_proeja_serializer.data + ppts_serializer.data)

        return Response(dependencias, status=status.HTTP_200_OK)

    except Aluno.DoesNotExist:
        logger.error("Nenhum aluno associado ao usuário logado.")
        return Response(
            {"erro": "Nenhum aluno associado ao usuário logado."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        logger.error("Erro ao listar PEDs do aluno: %s", str(e))
        return Response(
            {"erro": "Erro ao listar PEDs do aluno", "detalhes": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(['GET'])
@permission_classes([AlunoPermissao])
def detalhes_ped_aluno(request, pedId, modalidade):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId, aluno=request.user)
            serializer = PED_EMI_Serializer(ped, context={'request': request})
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId, aluno=request.user)
            serializer = PED_ProEJA_Serializer(ped, context={'request': request})
        else:
            return Response({'mensagem': "Modalidade inválida. Use 'Integrado' ou 'ProEJA'."},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AlunoPermissao])
def detalhes_ppt_aluno(request, pptId):
    try:
        ppt = get_object_or_404(PPT, pk=pptId, aluno=request.user)
        serializer = PPTSerializer(ppt, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

