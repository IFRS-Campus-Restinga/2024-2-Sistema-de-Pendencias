from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from google_auth.models import UsuarioBase


@api_view(['GET'])
def listar_servidores(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        # Listando e filtrando os dados
        servidores = UsuarioBase.objects.exclude(grupo__name="Aluno")

        if data_inicio and data_fim:
            servidores = servidores.filter(data_ingresso__range=(data_inicio, data_fim))

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)

        if ordenar_por in ['perfil', 'first_name', 'last_name']:
            servidores = servidores.order_by(ordenar_por)

        # Serialização dos dados
        servidores_serializer = UsuarioBaseSerializer(servidores, many=True)

        return Response(servidores_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deletar_servidor(request, id):
    try:
        servidor = UsuarioBase.objects.get(pk=id)

        servidor.delete()
        return Response({'mensagem': 'Servidor removido com sucesso.'}, status=status.HTTP_204_NO_CONTENT)
    except servidor.DoesNotExist:
        return Response({'mensagem': 'Servidor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)