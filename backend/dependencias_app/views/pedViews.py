from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from dependencias_app.serializers.pedSerializer import PED_Serializer
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED(request):
    try:
        data = request.data

        print(data)

        serializer = PED_Serializer(data=data)

        if not serializer.is_valid(): raise Exception(serializer.error_messages)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_400_BAD_REQUEST)
