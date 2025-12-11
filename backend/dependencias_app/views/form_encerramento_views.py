from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from fs_auth_middleware.decorators import has_permissions
from dependencias_app.services.acesso_service import AcessoException
from ..services.form_encerramento_service import FormEncerramentoService
from ..utils.formatar_erros import formatar_erros

@api_view(['POST'])
@has_permissions(['add_formencerramentointegrado', 'add_formencerramentoproeja'])
def cadastrar_form_encerramento(request, modalidade, ped_id):
    try:
        arquivo = FormEncerramentoService.criar(request, modalidade, ped_id)

        return Response({'message': 'Formulário de encerramento cadastrado com sucesso', 'form': arquivo}, status=status.HTTP_201_CREATED)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@has_permissions(['view_formencerramentointegrado', 'view_formencerramentoproeja'])
def detalhes_form_encerramento(request, modalidade, form_encerramento_id):
    try:
        form_encerramento, arquivo = FormEncerramentoService.detalhes(request, modalidade, form_encerramento_id)

        return Response({**form_encerramento, 'form': arquivo}, status=status.HTTP_200_OK)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@has_permissions(['change_formencerramentointegrado', 'change_formencerramentoproeja'])
def editar_form_encerramento(request, modalidade, form_encerramento_id):
    try:
        arquivo = FormEncerramentoService.editar(request, modalidade, form_encerramento_id)

        return Response({'message': 'Formulário de encerramento alterado com sucesso', 'form': arquivo}, status=status.HTTP_200_OK)
    except AcessoException as e:
        return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except serializers.ValidationError as e:
        return Response({'message': formatar_erros(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)