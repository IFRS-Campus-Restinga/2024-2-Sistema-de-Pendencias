from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from dependencias_app.utils.formatar_erros import formatar_erros
from ..services.acompanhamento_service import AcompanhamentoService, AcessoException
from fs_auth_middleware.decorators import has_permissions
from django.http import Http404

@api_view(['POST'])
@has_permissions(['add_acompanhamentointegrado', 'add_acompanhamentoproeja'])
def cadastrar_acompanhamento(request, modalidade):
    try:
        AcompanhamentoService.criar(request, modalidade)

        return Response({'message': 'Acompanhamento registrado com sucesso'}, status=status.HTTP_201_CREATED)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_acompanhamentointegrado', 'view_acompanhamentoproeja'])
def listar_acompanhamentos(request, modalidade, ped_id):
    try:
        return AcompanhamentoService.listar(request, modalidade, ped_id)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
@has_permissions(['change_acompanhamentointegrado', 'change_acompanhamentoproeja'])
def editar_acompanhamento(request, modalidade, acompanhamento_id):
    try:
        AcompanhamentoService.editar(request, modalidade, acompanhamento_id)

        return Response({'message': 'Atividade atualizada com sucesso!'}, status=status.HTTP_200_OK)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)