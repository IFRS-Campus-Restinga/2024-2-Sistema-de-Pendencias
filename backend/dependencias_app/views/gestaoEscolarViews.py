from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import Group
from dependencias_app.serializers.gestaoEscolarSerializer import GestaoEscolarSerializer
from django.contrib.auth.models import Group
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def cadastrar_gestao_escolar(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        # extrai o nome do perfil da requisição
        grupo = Group.objects.get(name=request.data.get('perfil', None))

        # valida o perfil
        if not isinstance(grupo, Group): raise Exception('Perfil inválido')

        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data.copy()
        data['grupo'] = grupo.id

        # passa o dicionario para o serializador
        serializer = GestaoEscolarSerializer(data=data)

        # valida os dados do serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.error_messages}')

        serializer.save()
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)
