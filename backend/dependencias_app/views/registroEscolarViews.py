from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from google_auth.models import UsuarioBase

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_registro_escolar(request):
    try:
        # extrai o nome do perfil da requisição
        name = request.data.get('grupo', None)

        if name != 'RegistroEscolar': raise Exception('perfil inválido')

        # valida o perfil
        grupo = Group.objects.get(name=name)

        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data
        data['grupo'] = grupo.id

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


@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listarRegistroEscolar(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        registro_escolar = UsuarioBase.objects.filter(
            grupo__name="RegistroEscolar",
            data_ingresso__range=(data_inicio, data_fim)
        )

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['first_name', 'last_name']:
            registro_escolar = registro_escolar.order_by(ordenar_por)

        # Serialização dos dados
        serializer = UsuarioBaseSerializer(registro_escolar, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)