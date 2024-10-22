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
        perfil_nome = request.data.get('perfil', None)

        if perfil_nome != 'GestaoEscolar':
            raise ValueError("O campo 'perfil' é obrigatório.")

        # tenta encontrar o grupo pelo nome
        try:
            grupo = Group.objects.get(name=perfil_nome)
        except Group.DoesNotExist:
            raise ValueError(f"Perfil '{perfil_nome}' não encontrado.")
        
        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data
        data['grupo'] = grupo.id

        # passa o dicionario para o serializador
        serializer = UsuarioBaseSerializer(data=data)

        # valida os dados do serializador
        if not serializer.is_valid(): raise Exception(f'{serializer.erros}')

        serializer.save()
        # retorna uma resposta positiva
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # retorna um erro
        return Response({'mensagem': str(e)}, status=400)


@api_view(['GET'])
def listarGestaoEscolar(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        gestao_escolar = GestaoEscolar.objects.all()

        if data_inicio and data_fim:
            gestao_escolar = gestao_escolar.filter(data_ingresso__range=[data_inicio, data_fim])

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['perfil', 'nome', 'matricula']:
            gestao_escolar = gestao_escolar.order_by(ordenar_por)

        # Serialização dos dados
        serializer = UsuarioBaseSerializer(gestao_escolar, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)