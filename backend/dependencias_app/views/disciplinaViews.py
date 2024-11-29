from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.disciplinaSerializer import DisciplinaSerializer
from dependencias_app.serializers.cursoSerializer import CursoSerializer

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_disciplina(request):
    curso_id = request.data.get('curso', None)
    disciplinas = request.data.get('disciplinas', None)
    novas_disciplinas = request.data.get('novasDisciplinas', None)

    try:
        print(request.data)
        curso = get_object_or_404(Curso, pk=curso_id)

        # Cria novas disciplinas e vincula ao curso
        for disciplina in novas_disciplinas:
            serializer = DisciplinaSerializer(data={
                'nome': disciplina.get('nome'),
                'carga_horaria': disciplina.get('carga_horaria'),
                'cursos': [curso.id]
            })

            if not serializer.is_valid(): raise Exception(serializer.errors)

            serializer.save()

        # busca disciplinas já existentes para vincular
        for id in disciplinas:
            disciplina = get_object_or_404(Disciplina, pk=id)
            disciplina.cursos.add(curso)

        return Response({'mensagem': 'Disciplinas cadastradas com sucesso!'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_disciplinas(request):
    """
    Função que lista todas as disciplinas cadastradas.
    Retorna uma lista de disciplinas em formato JSON ou um erro.
    """
    disciplinas = Disciplina.objects.all().order_by('nome')
    serializer = DisciplinaSerializer(disciplinas, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def buscar_disciplina(request, disciplinaId):
    disciplina = get_object_or_404(Disciplina, pk=disciplinaId)

    disciplina_serializer = DisciplinaSerializer(disciplina)

    cursos = Curso.objects.all().exclude(id__in=disciplina.cursos.values_list('id', flat=True))
    cursos_vinculados = Curso.objects.filter(id__in=disciplina.cursos.values_list('id', flat=True))

    curso_serializer = CursoSerializer(cursos, many=True)
    curso_vinculados_serializer = CursoSerializer(cursos_vinculados, many=True)

    return Response({'disciplina':disciplina_serializer.data, 'cursos': curso_serializer.data, 'cursos_vinculados': curso_vinculados_serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def editar_disciplina(request, disciplinaId):
    try:
        disciplina = get_object_or_404(Disciplina, pk=disciplinaId)

        serializer = DisciplinaSerializer(disciplina, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()
        
        return Response(serializer.data ,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
