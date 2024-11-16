from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.pedEMISerializer import PED_EMI_Serializer
from dependencias_app.serializers.pedProEJASerializer import PED_ProEJA_Serializer
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_EMI(request):
    try:
        data = request.data

        serializer = PED_EMI_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED_ProEJA(request):
    try:
        data = request.data

        print(data)

        serializer = PED_ProEJA_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def listar_PED_EMI(request, professorId=None):
    try:
        if  professorId:
            lista = PED_EMI.objects.filter(professor_ped=professorId)
        else:
            lista = PED_EMI.objects.all()

        serializer = PED_EMI_Serializer(lista, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def listar_PED_ProEJA(request, professorId=None):
    try:
        if professorId:
            lista = PED_ProEJA.objects.filter(professor_ped=professorId)
        else:
            lista = PED_ProEJA.objects.all()
        
        serializer = PED_ProEJA_Serializer(lista, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor])
def por_id(request, pedId):
    try:
        ped = get_object_or_404(PED_EMI, pk=pedId) or get_object_or_404(PED_ProEJA, pk=pedId)

        if isinstance(ped, PED_ProEJA): serializer = PED_ProEJA_Serializer(ped)
        
        if isinstance(ped, PED_EMI): serializer = PED_EMI_Serializer(ped)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([Professor])
def listar_por_professor(request, professor):
    try:
        ped_proeja = PED_ProEJA.objects.filter(professor_ped_proeja=professor)

        ped_emi = PED_EMI.objects.filter(professor_ped_emi=professor)

        serializer_proeja = PED_EMI_Serializer(ped_proeja)

        serializer_emi = PED_EMI_Serializer(ped_emi)

        return Response(serializer_emi.data + serializer_proeja.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
