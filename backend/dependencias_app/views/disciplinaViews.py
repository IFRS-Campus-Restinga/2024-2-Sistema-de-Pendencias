from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.utils.error_handler import handle_view_errors

@api_view(['POST'])
def cadastrar_disciplina(request):
    """
    Função que realiza o cadastro de uma nova Disciplina a partir do JSON recebido.
    Espera receber um JSON com os campos da Disciplina; caso contrário, retorna um erro.
    """
    curso_id = request.data.get('curso', None)

    # Verifica se o curso existe
    try:
        curso = Curso.objects.get(pk=curso_id)
    except Curso.DoesNotExist:
        return Response({"error": "Curso não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # Cria um dicionário de dados para o serializer
    data = request.data.copy()  # Faz uma cópia para evitar problemas
    data['curso'] = curso.id  # Adiciona o ID do curso

    print(data)
    # Cria e valida o serializer
    serializer = DisciplinaSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retorna os erros de validação

    # Salva a nova disciplina
    serializer.save()

    return Response({
        "message": "Disciplina criada com sucesso.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@handle_view_errors
def listar_disciplinas(request):
    """
    Função que lista todas as disciplinas cadastradas.
    Retorna uma lista de disciplinas em formato JSON ou um erro.
    """
    disciplinas = Disciplina.objects.all()
    serializer = DisciplinaSerializer(disciplinas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@handle_view_errors
def buscar_disciplina(request, id):
    """
    Tenta buscar a Disciplina pelo ID.
    Retorna um JSON com os campos da Disciplina buscada ou erro.
    """
    disciplina = get_object_or_404(Disciplina, id=id)

    return Response({

        'id': disciplina.id,
        'nome': disciplina.name,
        'carga_horaria': disciplina.carga_horaria,
        'curso': disciplina.curso.nome

    }, status=status.HTTP_200_OK)

