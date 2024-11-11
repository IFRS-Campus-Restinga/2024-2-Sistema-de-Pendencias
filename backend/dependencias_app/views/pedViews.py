from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.ped import PED
from dependencias_app.serializers.pedSerializer import PED_Serializer
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED(request):
    try:
        data = request.data

        serializer = PED_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([Professor])
def por_id(request, pedId):
    try:
        ped = get_object_or_404(PED, pk=pedId)

        serializer = PED_Serializer(ped)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([Professor])
def listar_por_professor(request, professor):
    try:
        lista_ped = PED.objects.filter(professor=professor)

        serializer = PED_Serializer(lista_ped, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
