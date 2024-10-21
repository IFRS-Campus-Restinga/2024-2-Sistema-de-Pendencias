from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from django.contrib.auth.models import Group
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_gestao_escolar(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        # extrai o nome do perfil da requisição
        grupo = Group.objects.get(name=request.data.get('perfil', None))

        # valida o perfil
        if not isinstance(grupo, Group): raise Exception('Perfil inválido')

        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data
        data['perfil'] = grupo.id

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
