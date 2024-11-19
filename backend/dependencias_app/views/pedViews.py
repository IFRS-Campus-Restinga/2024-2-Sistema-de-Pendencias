from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.pedEMISerializer import *
from dependencias_app.serializers.pedProEJASerializer import *
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_EMI(request):
    try:
        data = request.data

        serializer = PED_EMI_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()

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

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def listar_PED_EMI(request):
    try:
        professorId = request.GET.get('professorId')  # Captura o parâmetro de query da URL

        if  professorId:
            lista = PED_EMI.objects.filter(professor_ped=professorId)
        else:
            lista = PED_EMI.objects.all()

        serializer = PED_EMI_Serializer(lista, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def listar_PED_ProEJA(request):
    try:
        professorId = request.GET.get('professorId')  # Captura o parâmetro de query da URL

        if professorId:
            lista = PED_ProEJA.objects.filter(professor_ped=professorId)
        else:
            lista = PED_ProEJA.objects.all()
        
        serializer = PED_ProEJA_Serializer(lista, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def por_id(request, pedId, modalidade):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)

            serializer = PED_EMI_Serializer(ped)
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)

            serializer = PED_ProEJA_Serializer(ped)

        return Response(serializer.data, status=status.HTTP_200_OK)
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