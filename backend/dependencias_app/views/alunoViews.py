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
    peds_emi_serializer = peds_proeja_serializer = ppts_serializer = []

    try:
        aluno = request.user

        peds_emi = PED_EMI.objects.filter(aluno=aluno).order_by('-data_criacao')
        peds_proeja = PED_ProEJA.objects.filter(aluno=aluno).order_by('-data_criacao')
        ppts = PPT.objects.filter(aluno=aluno).order_by('-data_criacao')

        if peds_emi: 
            peds_emi_serializer = PED_EMI_Serializer(peds_emi, many=True, context={"request": request})
        if peds_proeja: 
            peds_proeja_serializer = PED_ProEJA_Serializer(peds_proeja, many=True, context={"request": request})
        if ppts: 
            ppts_serializer = PPTSerializer(ppts, many=True, context={'request': request})

        dependencias = (
            getattr(peds_emi_serializer, 'data', []) +
            getattr(peds_proeja_serializer, 'data', []) +
            getattr(ppts_serializer, 'data', [])
        )

        return Response(dependencias, status=status.HTTP_200_OK)

    except Aluno.DoesNotExist:
        return Response(
            {"erro": "Nenhum aluno associado ao usuário logado."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"erro": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
