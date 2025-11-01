from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from fs_auth_middleware.decorators import has_permissions
from ..services.plano_estudos_service import PlanoEstudosService
from ..utils.formatar_erros import formatar_erros

@api_view(['POST'])
@has_permissions(['add_planoestudosintegrado', 'add_planoestudosproeja'])
def cadastrar_plano_estudos(request, modalidade):
    try:
        arquivo = PlanoEstudosService.criar(request, modalidade)

        return Response({'message': 'Plano de estudos cadastrado com sucesso', 'plano': arquivo}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_planoestudosintegrado', 'view_planoestudosproeja'])
def detalhes_plano_estudos(request, modalidade, plano_estudos_id):
    try:
        plano_estudos, arquivo = PlanoEstudosService.detalhes(request, modalidade, plano_estudos_id)

        return Response({**plano_estudos, 'plano': arquivo}, status=status.HTTP_200_OK)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@has_permissions(['change_planoestudosintegrado', 'change_planoestudosproeja'])
def editar_plano_estudos(request, modalidade, plano_estudos_id):
    try:
        arquivo = PlanoEstudosService.editar(request, modalidade, plano_estudos_id)

        return Response({'message': 'Plano de estudos alterado com sucesso', 'plano': arquivo}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)