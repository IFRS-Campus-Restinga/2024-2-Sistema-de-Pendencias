import os
import threading
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.ped_EMI import PED_EMI
from dependencias_app.models.ped_ProEJA import PED_ProEJA
from dependencias_app.serializers.ped_EMI_serializer import *
from dependencias_app.serializers.ped_ProEJA_serializer import *
from dependencias_app.permissoes import *
from dependencias_app.utils.enviar_email import enviar_email

template = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    'templates_email',
    'novaPED.html'
    )

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED(request, modalidade):
    try:
        data = request.data

        if modalidade == 'Integrado':
            serializer = PED_EMI_Serializer(data=data)
        elif modalidade == 'ProEJA':
            serializer = PED_ProEJA_Serializer(data=data)
        else:
            raise Exception('Modalidade inválida')

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

        # envia email para o professor responsável e aluno da ped de forma assíncrona
        threading.Thread(target=enviar_email, args=(serializer.instance.aluno, template, 'Nova Dependência Cadastrada', serializer.instance.aluno.grupo.name)).start()
        threading.Thread(target=enviar_email, args=(serializer.instance.professor_ped, template, 'Nova Dependência Cadastrada', serializer.instance.professor_ped.grupo.name)).start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador])
def listar_PED(request, modalidade, professorId=None):
    try:
        professorId = request.GET.get('professorId')  # Captura o parâmetro de query da URL
        coordenadorId = request.user.id

        if modalidade == 'Integrado':
            modelo = PED_EMI
            serializer_class = PED_EMI_Serializer
        elif modalidade == 'ProEJA':
            modelo = PED_ProEJA
            serializer_class = PED_ProEJA_Serializer

        if  professorId:
            lista = modelo.objects.filter(professor_ped=professorId)
        elif coordenadorId and request.user.grupo.name == 'Coordenador':
            lista = modelo.objects.filter(curso__coordenador_id=coordenadorId)
        else:
            lista = modelo.objects.all()

        serializer = serializer_class(lista, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador | Aluno])
def detalhes_PED(request, pedId, modalidade):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)
            serializer = PED_EMI_Serializer(ped, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
            serializer = PED_ProEJA_Serializer(ped, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Caso a modalidade não seja reconhecida
        return Response(
            {'mensagem': "Modalidade inválida. Use 'Integrado' ou 'ProEJA'."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_PED(request, modalidade, pedId):
    try:
        if modalidade == 'Integrado':
            modelo = PED_EMI
            serializer_class = PED_EMI_Serializer
        elif modalidade == 'ProEJA':
            modelo = PED_ProEJA
            serializer_class = PED_ProEJA_Serializer
        else:
            raise Exception('Modalidade inválida')
        
        ped = get_object_or_404(modelo, pk=pedId)

        serializer = serializer_class(ped, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def desativar_PED(request, modalidade, pedId):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
        
        ped.status = 'Desativado'
        ped.save()
        
        return Response({"message": "PED desativado com sucesso."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
