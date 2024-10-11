from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dependencias_app.serializers.registroEscolarSerializer import RegistroEscolarSerializer

@api_view(['POST'])
def cadastrar_registro_escolar(request):
    return cadastrar_usuario(request, 'registro_escolar')

def cadastrar_usuario(request, perfil):
    if request.method == 'POST':
        data = request.data
        data['perfil'] = perfil  # Adiciona o tipo de perfil
        serializer = RegistroEscolarSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
