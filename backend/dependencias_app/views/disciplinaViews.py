from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.utils.errorsHandler import handle_view_errors

@api_view(['POST'])
@handle_view_errors
@permission_classes([GestaoEscolar])
def create_disciplina(request):
    serializer = DisciplinaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@handle_view_errors
@permission_classes([GestaoEscolar])
def list_disciplinas(request):
    """
    Função que lista todas as disciplinas cadastradas.
    Retorna uma lista de disciplinas em formato JSON ou um erro.
    """
    disciplinas = Disciplina.objects.all()
    serializer = DisciplinaSerializer(disciplinas, many=True)
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
@handle_view_errors
@permission_classes([GestaoEscolar])
def get_disciplina(request, id):
    """
    Tenta buscar a Disciplina pelo ID.
    Retorna um JSON com os campos da Disciplina buscada ou erro.
    """
    disciplina = get_object_or_404(Disciplina, id=id)
    return JsonResponse({
        'id': disciplina.id,
        'nome': disciplina.name,
        'carga_horaria': disciplina.carga_horaria,
        'curso': disciplina.curso.nome
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@handle_view_errors
@permission_classes([GestaoEscolar])
def update_disciplina(request, pk):
    """
    Função que realiza a atualização de uma Disciplina existente.
    Retorna os dados da Disciplina atualizada ou um erro de validação.
    """
    disciplina = get_object_or_404(Disciplina, pk=pk)
    serializer = DisciplinaSerializer(disciplina, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@handle_view_errors
@permission_classes([GestaoEscolar])
def delete_disciplina(request, pk):
    """
    Função que realiza a exclusão de uma Disciplina existente.
    Retorna um status 204 em caso de sucesso ou um erro em caso de falha.
    """
    disciplina = get_object_or_404(Disciplina, pk=pk)
    disciplina.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
