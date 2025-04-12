from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.disciplina_serializer import Disciplina_Serializer
from dependencias_app.serializers.curso_serializer import Curso_Serializer

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_disciplina(request):
    cursos = request.data.pop('cursos', None)
    data = request.data
    try:
        uuid_cursos = []

        for curso in cursos:
            uuid_cursos.append(curso.get('id'))

        data['cursos'] = uuid_cursos
    
        serializer = Disciplina_Serializer(data=request.data)

        if not serializer.is_valid(): raise serializers.ValidationError(serializer.errors)

        serializer.save()
        return Response({'mensagem': 'Disciplina registrada com sucesso!'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        error_details = e.detail
        mensagens = []

        if isinstance(error_details, dict):
            for campo, erros in error_details.items():
                for erro in erros:
                    mensagens.append(f"{campo}: {str(erro)}")
        elif isinstance(error_details, list):
            for erro in error_details:
                mensagens.append(str(erro))
        else:
            mensagens.append(str(error_details))

        return Response({'mensagem': mensagens}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_disciplinas(request):
    """
    Função que lista todas as disciplinas cadastradas.
    Retorna uma lista de disciplinas em formato JSON ou um erro.
    """
    disciplinas = Disciplina.objects.all().order_by('nome')
    serializer = Disciplina_Serializer(disciplinas, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def buscar_disciplina(request, disciplinaId):
    disciplina = get_object_or_404(Disciplina, pk=disciplinaId)

    disciplina_serializer = Disciplina_Serializer(disciplina)

    cursos = Curso.objects.all().exclude(id__in=disciplina.cursos.values_list('id', flat=True))
    cursos_vinculados = Curso.objects.filter(id__in=disciplina.cursos.values_list('id', flat=True))

    curso_serializer = Curso_Serializer(cursos, many=True)
    curso_vinculados_serializer = Curso_Serializer(cursos_vinculados, many=True)

    return Response({'disciplina':disciplina_serializer.data, 'cursos': curso_serializer.data, 'cursos_vinculados': curso_vinculados_serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def editar_disciplina(request, disciplinaId):
    try:
        disciplina = get_object_or_404(Disciplina, pk=disciplinaId)

        cursos = request.data.pop('cursos')

        request.data['cursos'] = [curso['id'] for curso in cursos]

        serializer = Disciplina_Serializer(disciplina, data=request.data)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        serializer.save()
        
        return Response(serializer.data ,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
