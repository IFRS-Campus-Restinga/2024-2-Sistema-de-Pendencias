from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.serializers.disciplina_serializer import *

@api_view(['POST'])
def create_disciplina(request):
    """
    Função que realiza o cadastro de uma nova disciplina a partir do JSON recebido.
    """
    serializer = DisciplinaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_disciplinas(request):
    """
    Função que realiza a busca de todas as disciplinas cadastradas.
    """
    disciplinas = Disciplina.objects.all()
    serializer = DisciplinaSerializer(disciplinas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def get_disciplina(request, id):
    # Tenta buscar a disciplina pelo ID, se não encontrar, retorna um erro 404
    disciplina = get_object_or_404(Disciplina, id=id)


    return JsonResponse({
        'id': disciplina.id,
        'nome': disciplina.name,
        'carga_horaria': disciplina.carga_horaria,
        'curso': disciplina.curso.nome  # Caso queira retornar também o nome do curso
    })

@api_view(['PUT'])
def update_disciplina(request, pk):
    """
    Função que realiza a atualização de uma disciplina existente.
    """
    disciplina = get_object_or_404(Disciplina, pk=pk)  # Obtém a disciplina com base no ID
    serializer = DisciplinaSerializer(disciplina, data=request.data)  # Usa os dados atualizados
    if serializer.is_valid():
        serializer.save()  # Salva as mudanças
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_disciplina(request, pk):
    """
    Função que realiza a exclusão de uma disciplina existente.
    """
    disciplina = get_object_or_404(Disciplina, pk=pk)  # Obtém a disciplina com base no ID
    disciplina.delete()  # Remove a disciplina
    return Response(status=status.HTTP_204_NO_CONTENT)
