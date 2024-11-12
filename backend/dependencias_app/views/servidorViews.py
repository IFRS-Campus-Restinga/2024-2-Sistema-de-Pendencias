from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from google_auth.models import UsuarioBase


@api_view(['GET'])
def listar_servidores(request):
    try:
        # Filtros adicionais
        filtro_geral = request.GET.get('filtroGeral', None)  # Novo filtro para nome e matrícula
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)

        # Listando e filtrando os dados
        servidores = UsuarioBase.objects.exclude(grupo__name="Aluno")

        if filtro_geral:
            servidores = servidores.filter(
                Q(nome__icontains=filtro_geral) | 
                Q(infos_professor__matricula__icontains=filtro_geral) |
                Q(infos_professor__cpf__icontains=filtro_geral) |
                Q(email__icontains=filtro_geral)
            )
        
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

@api_view(['GET'])
def visualizar_servidor(request, id):
    try:
        servidor = UsuarioBase.objects.get(pk=id)
        
        servidor_serializer = UsuarioBaseSerializer(servidor)

        return Response(servidor_serializer.data, status=status.HTTP_200_OK)
    except UsuarioBase.DoesNotExist:
        return Response({'mensagem': 'Servidor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
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

@api_view(['PUT'])
def editar_servidor(request, id):
    try:
        servidor = UsuarioBase.objects.get(pk=id)

        print("Dados recebidos:", request.data)

        servidor_serializer = UsuarioBaseSerializer(servidor, data=request.data)

        if servidor_serializer.is_valid():
            servidor_serializer.save()
            return Response(servidor_serializer.data, status=status.HTTP_200_OK)
        else:
            # Imprima os erros detalhados de validação
            print("Erros de validação:", servidor_serializer.errors)
            return Response(servidor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UsuarioBase.DoesNotExist:
        return Response({'mensagem': 'Servidor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
