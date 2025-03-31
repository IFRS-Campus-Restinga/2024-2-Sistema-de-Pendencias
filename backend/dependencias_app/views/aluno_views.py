from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers
from dependencias_app.permissoes import Aluno as Aluno_Permissao
from dependencias_app.permissoes import *
from dependencias_app.serializers.usuario_serializer import Usuario_Serializer
from dependencias_app.serializers.aluno_serializer import Aluno_Serializer
from dependencias_app.models.aluno import Aluno
from dependencias_app.models.ped_EMI import PED_EMI
from dependencias_app.models.ped_ProEJA import PED_ProEJA
from dependencias_app.models.ppt import PPT
from dependencias_app.serializers.ped_EMI_serializer import PED_EMI_Serializer
from dependencias_app.serializers.ped_ProEJA_serializer import PED_ProEJA_Serializer
from dependencias_app.serializers.ppt_serializer import PPT_Serializer
from google_auth.models import Usuario

@api_view(['POST'])
@permission_classes([GestaoEscolar | Aluno_Permissao])
def infos_adicionais_aluno(request):
    usuario_id = request.user.id

    try:
        aluno = Aluno.objects.get(usuario_id=usuario_id)

        if aluno:
            serializer_aluno = Aluno_Serializer(aluno, data=request.data, partial=True)
        else:
            serializer_aluno = Aluno_Serializer(data=request.data)

        if not serializer_aluno.is_valid(): raise serializers.ValidationError(serializer_aluno.errors)

        serializer_aluno.save()
        return Response(serializer_aluno.data, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Aluno_Permissao])
def get_aluno_infos (request):
    try:
        aluno = Aluno.objects.get(usuario_id=request.user.id)

        serializer_aluno = Aluno_Serializer(aluno)

        return Response(data=serializer_aluno.data, status=status.HTTP_200_OK)
    except Aluno.DoesNotExist: return Response(data={}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)   

@api_view(['GET'])
@permission_classes([Aluno_Permissao])
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
            ppts_serializer = PPT_Serializer(ppts, many=True, context={'request': request})

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
