from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.utils.error_handler import handle_view_errors

import logging



logger = logging.getLogger(__name__)

@api_view(['POST'])
def cadastrar_curso(request):
    # Extraia os dados da requisição
    turmas_numeros = request.data.get('turmas', [])  # Lista de números das turmas
    serializer = CursoSerializer(data=request.data)

    if serializer.is_valid():
        curso = serializer.save()  # Cria o curso

        # Criar uma turma para cada número na lista
        for numero in turmas_numeros:
            turma_data = {
                'numero': numero,
                'curso': curso.id  # Vincula a turma ao curso recém-criado
            }
            turma_serializer = TurmaSerializer(data=turma_data)

            if turma_serializer.is_valid():
                turma_serializer.save()  # Salva a turma no banco de dados
            else:
                # Se houver erro na criação da turma, pode ser interessante retornar o erro
                return Response(turma_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'id': curso.id, 'message': 'Curso cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@handle_view_errors
def listar_cursos(request):
    """
    Função que lista todos os cursos cadastrados.
    Retorna uma lista de cursos em formato JSON ou um erro.
    """
    cursos = Curso.objects.all()  # Obtém todos os cursos
    serializer = CursoSerializer(cursos, many=True)  # Serializa os cursos
    return Response(serializer.data, safe=False, status=status.HTTP_200_OK)

