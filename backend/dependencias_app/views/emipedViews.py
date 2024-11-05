from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.professor import Professor
from dependencias_app.serializers import EmiPedSerializer
from dependencias_app.utils.error_handler import handle_view_errors

@api_view(['POST'])
@handle_view_errors
def cadastrar_emiped(request):
    """
    Função que realiza o cadastro de uma nova DependenciaEMIPED a partir do JSON recebido.
    Espera receber um JSON com os campos da DependenciaEMIPED; caso contrário, retorna um erro.
    """
    # Cria um dicionário de dados para o serializer
    data = request.data.copy()  # Faz uma cópia para evitar problemas

    # Verificações de existência com tratamento de erros
    try:
        curso_id = data.get('curso')
        curso = Curso.objects.get(pk=curso_id)
        data['curso'] = curso.id  # Adiciona o ID do curso
    except Curso.DoesNotExist:
        return Response({"error": "Curso não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    try:
        turma_id = data.get('turma')
        turma = Turma.objects.get(pk=turma_id)
        data['turma'] = turma.id  # Adiciona o ID da turma
    except Turma.DoesNotExist:
        return Response({"error": "Turma não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    try:
        disciplina_id = data.get('disciplina')
        disciplina = Disciplina.objects.get(pk=disciplina_id)
        data['disciplina'] = disciplina.id  # Adiciona o ID da disciplina
    except Disciplina.DoesNotExist:
        return Response({"error": "Disciplina não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    try:
        professor_id = data.get('professor')
        professor = Professor.objects.get(pk=professor_id)
        data['professor'] = professor.id  # Adiciona o ID do professor
    except Professor.DoesNotExist:
        return Response({"error": "Professor não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # Cria e valida o serializer
    serializer = EmiPedSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retorna os erros de validação

    # Salva a nova dependência
    serializer.save()

    return Response({
        "message": "Dependência criada com sucesso.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)
