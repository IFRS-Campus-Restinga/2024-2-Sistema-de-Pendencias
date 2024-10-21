from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_registro_escolar(request):
    try:
        name = request.data.get('perfil', None)

        print(name)
        # extrai o nome do perfil da requisição
        grupo = Group.objects.get(name=name)

        # valida o perfil
        if not isinstance(grupo, Group): raise Exception('perfil inválido')

        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data
        data['perfil'] = grupo.id

        print(data)
        # passa o dicionario para o serializador
        serializer = UsuarioBaseSerializer(data=data)

        # valida os dados do serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.error_messages}')

        serializer.save()
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)
