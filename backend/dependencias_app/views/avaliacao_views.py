from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from fs_auth_middleware.decorators import has_permissions
from dependencias_app.services.avaliacao_service import AvaliacaoService

@api_view(['POST'])
@has_permissions(["add_avaliacaoproeja", "add_avaliacaointegrado", "change_avaliacaoproeja", "change_avaliacaointegrado"])
def salvar_plano_atividades(request, modalidade, ped_id):
    try:
        AvaliacaoService.salvar_plano_estudos(request, modalidade, ped_id)

        return Response({'mensagem': 'Plano de estudos salvo com sucesso'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@has_permissions(["view_avaliacaoproeja", "view_avaliacaointegrado"])
def listar_avaliacoes_por_PED(request, modalidade, ped_id):
    try:
        return Response(AvaliacaoService.listar_avaliacoes(request, modalidade, ped_id), status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)