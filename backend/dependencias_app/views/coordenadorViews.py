from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from google_auth.models import UsuarioBase

@api_view(['POST'])
def cadastrarCoordenador(request):
    try:
        name = request.data.get('perfil', None)

        if name != 'Coordenador': raise Exception('perfil inválido')

        # valida o perfil
        grupo = Group.objects.get(name=name)

        # adiciona o id do grupo correspondente ao perfil em um dicionario
        data = request.data
        data['grupo'] = grupo.id
        data.pop('perfil', None)

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
def listarCoordenadores(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        coordenadores = UsuarioBase.objects.filter(grupo__name='Coordenador')

        if data_inicio and data_fim:
            coordenadores = coordenadores.filter(data_ingresso__range=(data_inicio, data_fim))

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['perfil', 'first_name', 'last_name']:
            coordenadores = coordenadores.order_by(ordenar_por)

        # Serialização dos dados
        serializer = UsuarioBaseSerializer(coordenadores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
