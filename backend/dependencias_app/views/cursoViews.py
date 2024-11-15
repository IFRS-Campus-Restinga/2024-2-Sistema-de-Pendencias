from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import *
from dependencias_app.serializers.cursoSerializer import CursoSerializer
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from dependencias_app.serializers.turmaSerializer import TurmaSerializer
from dependencias_app.utils.error_handler import handle_view_errors
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_curso(request):
    # Extraia os dados da requisição
    turmas = request.data.get('turmas', [])  # Lista de números das turmas
    
    modalidade = request.data.get('modalidade', None)
    data = request.data

    print(data)

    serializer = CursoSerializer(data=data)

    if serializer.is_valid():
        curso = serializer.save()  # Cria o curso
    
        if modalidade == 'Integrado':
            if not turmas: raise Exception('O cursos da modalidade integrado devem ter turmas vinculadas')
            # Criar uma turma para cada número na lista
            for turma in turmas:
                turma['curso'] = curso.id
                turma_serializer = TurmaSerializer(data=turma)

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
    cursos = Curso.objects.all()  # Obtém todos os cursos
    serializer = CursoSerializer(cursos, many=True)  # Serializa os cursos
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
def listar_turmas_por_curso(request, curso_id):
    try:
        curso = Curso.objects.get(id=curso_id)
        turmas = Turma.objects.filter(curso=curso)
        
        # Serializa os dados das turmas
        serializer = TurmaSerializer(turmas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Curso.DoesNotExist:
        return Response({'error': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
def obter_curso(request, curso_id):
    try:
        curso = Curso.objects.get(id=curso_id)  # Buscando o curso pelo ID
        serializer = CursoSerializer(curso)  # Serializando o curso encontrado
        return Response(serializer.data, status=status.HTTP_200_OK)  # Retorna os dados do curso em formato JSON com status 200 OK
    except Curso.DoesNotExist:
        logger.error('Curso não encontrado: ID %s', curso_id)
        return Response({'mensagem': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)  # Retorna erro 404 caso não encontre o curso
    except Exception as e:
        logger.error('Erro ao obter curso: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # Retorna erro 500 para qualquer outro tipo de erro  


@api_view(['PUT'])
def atualizar_curso(request, curso_id):
    try:
        curso = Curso.objects.get(id=curso_id)  # Buscando o curso pelo ID
        serializer = CursoSerializer(curso, data=request.data)  # Atualizando o curso com os dados da requisição
        if serializer.is_valid():  # Verificando se os dados são válidos
            serializer.save()  # Salvando as alterações no curso
            logger.info('Curso atualizado com sucesso: %s', serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)  # Retorna os dados do curso atualizado com status 200 OK
        logger.error('Erro de validação na atualização: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retorna erro 400 se os dados forem inválidos

    except Curso.DoesNotExist:
        logger.error('Curso não encontrado para atualização: ID %s', curso_id)
        return Response({'mensagem': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)  # Retorna erro 404 caso o curso não exista
    except Exception as e:
        logger.error('Erro ao atualizar curso: %s', str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # Retorna erro 500 para outros erros      