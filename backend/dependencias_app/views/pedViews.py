import os
import threading
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.models.notificacao import Notificacao
from dependencias_app.serializers.pedEMISerializer import *
from dependencias_app.serializers.pedProEJASerializer import *
from dependencias_app.permissoes import *
from dependencias_app.utils.enviar_email import enviar_email


@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_EMI(request):
    try:
        data = request.data

        serializer = PED_EMI_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

        # busca o caminho do template
        template = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'templates_email',
        'novaPED.html'
        )

        # envia email para o professor responsável e aluno da ped de forma assíncrona
        threading.Thread(target=enviar_email, args=(serializer.instance.aluno, template, 'Nova Dependência Cadastrada', serializer.instance.aluno.grupo.name)).start()
        threading.Thread(target=enviar_email, args=(serializer.instance.professor_ped, template, 'Nova Dependência Cadastrada', serializer.instance.professor_ped.grupo.name)).start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_ProEJA(request):
    try:
        data = request.data

        serializer = PED_ProEJA_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

        # busca o caminho do template
        template = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'templates_email',
        'novaPED.html'
        )

        # envia email para o professor responsável e aluno da ped de forma assíncrona
        threading.Thread(target=enviar_email, args=(serializer.instance.aluno, template, 'Nova Dependência Cadastrada', serializer.instance.aluno.grupo.name)).start()
        threading.Thread(target=enviar_email, args=(serializer.instance.professor_ped, template, 'Nova Dependência Cadastrada', serializer.instance.professor_ped.grupo.name)).start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador])
def listar_PED_EMI(request):
    try:
        professorId = request.GET.get('professorId')  # Captura o parâmetro de query da URL
        coordenadorId = request.user.id

        if  professorId:
            lista = PED_EMI.objects.filter(professor_ped=professorId)

        elif coordenadorId and request.user.grupo.name == 'Coordenador':
            lista = PED_EMI.objects.filter(curso__coordenador_id=coordenadorId)
            
        else:
            lista = PED_EMI.objects.all()

        serializer = PED_EMI_Serializer(lista, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador])
def listar_PED_ProEJA(request):
    try:
        professorId = request.GET.get('professorId')  # Captura o parâmetro de query da URL
        coordenadorId = request.user.id

        if professorId:
            lista = PED_ProEJA.objects.filter(professor_ped=professorId)
            
        elif coordenadorId and request.user.grupo.name == 'Coordenador':
            lista = PED_ProEJA.objects.filter(curso__coordenador_id=coordenadorId)
            
        else:
            lista = PED_ProEJA.objects.all()
        
        serializer = PED_ProEJA_Serializer(lista, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador | Aluno])
def por_id(request, pedId, modalidade):
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


@api_view(['POST'])
@permission_classes([GestaoEscolar])
def atualizar_EMI(request, pedId):
    try:

        print(request.data)
        ped = get_object_or_404(PED_EMI, pk=pedId)

        serializer = PED_EMI_Serializer(ped, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def atualizar_ProEJA(request, pedId):
    try:
        ped = get_object_or_404(PED_ProEJA, pk=pedId)

        serializer = PED_ProEJA_Serializer(ped, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def desativar_PED(request, pedId, modalidade):
    try:
        if modalidade == 'EMI':
            ped = get_object_or_404(PED_EMI, pk=pedId)
            serializer = PED_EMI_Serializer(ped)
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
            serializer = PED_ProEJA_Serializer(ped)
        
        serializer.set_disabled(ped)
        
        return Response({"message": "PED {modalidade} desativado com sucesso."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
