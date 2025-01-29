from django.shortcuts import *
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_curso(request):
    try:
        turmas = request.data.pop('turmas', [])
        data = request.data

        if (data['modalidade'] == 'Integrado' and turmas == []): raise Exception('Os cursos de modalidade Integrado devem possuir turmas cadastradas')

        serializer_curso = CursoSerializer(data=data)

        if not serializer_curso.is_valid(): raise Exception(serializer_curso.errors)

        serializer_curso.save()

        if (serializer_curso.instance.modalidade == 'Integrado'):
            for turma in turmas:
                turma['curso'] = serializer_curso.instance
                serializer_turma = TurmaSerializer(turma)

                if not serializer_turma.is_valid(): raise Exception(serializer_turma.errors)

                serializer_turma.save()   

        return Response({'message': 'Curso cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_cursos(request):
    cursos = Curso.objects.all()  # Obtém todos os cursos
    serializer = CursoSerializer(cursos, many=True, context={'request': request})  # Serializa os cursos
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_por_modalidade(request, modalidade):
    try:
        cursos = Curso.objects.filter(modalidade=modalidade)  # Obtém todos os cursos pela modalidade ProEJA/Integrado
        serializer = CursoSerializer(cursos, many=True)  # Serializa os cursos
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([Professor])
def listar_turmas_por_curso(request, cursoId):
    try:
        curso = Curso.objects.get(id=cursoId)
        turmas = Turma.objects.filter(curso=curso)
        
        # Serializa os dados das turmas
        serializer = TurmaSerializer(turmas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Curso.DoesNotExist:
        return Response({'error': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
def obter_curso(request, cursoId):
    try:
        curso = Curso.objects.get(id=cursoId)  # Buscando o curso pelo ID
        serializer = CursoSerializer(curso, context={'request': request})  # Serializando o curso encontrado
        
        return Response(serializer.data, status=status.HTTP_200_OK)  # Retorna os dados do curso em formato JSON com status 200 OK
    except Curso.DoesNotExist:
        return Response({'mensagem': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)  # Retorna erro 404 caso não encontre o curso
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # Retorna erro 500 para qualquer outro tipo de erro  

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_curso(request, cursoId):
    turmas = request.data.pop('turmas', [])  # Pega as turmas enviadas

    try:
        data = request.data

        if (data['modalidade'] == 'Integrado' and turmas == []): raise Exception('Os cursos de modalidade Integrado devem possuir turmas cadastradas')

        curso = get_object_or_404(Curso, pk=cursoId)

        serializer_curso = CursoSerializer(curso, data=data)

        if not serializer_curso.is_valid(): raise Exception(serializer_curso.errors)

        for dados_turma in turmas:
            turma = get_object_or_404(Turma, pk=dados_turma['id'])

            serializer_turma = TurmaSerializer(turma, data=dados_turma)

            if not serializer_turma.is_valid(): raise Exception(serializer_turma.errors)
            serializer_turma.save()

        return Response({'mensagem': 'Curso atualizado com sucesso'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)