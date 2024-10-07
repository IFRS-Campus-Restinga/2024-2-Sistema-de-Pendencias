from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dependencias_app.serializers import ServidorSerializers

@api_view(['POST'])
def cadastrar_servidor(request):
    serializer = ServidorSerializers(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)