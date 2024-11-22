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
from django.db import transaction

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_curso(request):
    # Extraímos os dados da requisição
    data = request.data
    turmas = data.pop('turmas', [])  # Remove 'turmas' do payload (não será mais processado aqui)
    modalidade = data.get('modalidade', None)

    print("Dados do curso:", data)
    print("Turmas recebidas:", turmas)

    # Criar o serializer do curso
    serializer = CursoSerializer(data=data)

    if serializer.is_valid():
        curso = serializer.save()  # Cria o curso
        print(f"Curso {curso.id} criado com sucesso!")

        # Se houver turmas associadas, crie e associe ao curso
        if turmas:
            for turma_data in turmas:
                turma_data['curso'] = curso  # Associa o curso à turma
                Turma.objects.create(**turma_data)  # Cria a turma associada
                print(f"Turma criada com sucesso para o curso {curso.id}")

        # Verificar se a modalidade é 'Integrado' e garantir que tenha turmas associadas
        if modalidade == 'Integrado' and not turmas:
            return Response({'detail': 'O curso da modalidade integrado deve ter turmas vinculadas.'},
                             status=status.HTTP_400_BAD_REQUEST)

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
   
# @api_view(['PUT'])
# @permission_classes([GestaoEscolar])
# def atualizar_curso(request, curso_id):
#     # Extraímos os dados da requisição
#     turmas = request.data.get('turmas', [])  # Pega as turmas enviadas
#     modalidade = request.data.get('modalidade', None)

#     try:
#         curso = Curso.objects.get(id=curso_id)  # Busca o curso pelo ID
#     except Curso.DoesNotExist:
#         return Response({'message': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)

#     # Atualiza o curso com os dados recebidos
#     serializer = CursoSerializer(curso, data=request.data, partial=True)  # partial=True permite atualizar apenas campos específicos

#     if serializer.is_valid():
#         updated_curso = serializer.save()  # Atualiza o curso

#         # Agora lidamos com a atualização das turmas associadas
#         if turmas:
#             # Para cada turma, vamos verificar se ela precisa ser atualizada, criada ou removida
#             existing_turmas_ids = [turma_data.get('id') for turma_data in turmas if turma_data.get('id') is not None]

#             # 1. Atualizar ou criar turmas
#             for turma_data in turmas:
#                 turma_id = turma_data.get('id', None)  # Se o id da turma estiver presente

#                 if turma_id:
#                     # Se a turma já existe, atualize-a
#                     try:
#                         turma = Turma.objects.get(id=turma_id, curso=updated_curso)  # Busca a turma associada ao curso
#                         turma.numero = turma_data.get('numero', turma.numero)  # Atualiza o número da turma
#                         turma.save()  # Salva a turma
#                     except Turma.DoesNotExist:
#                         return Response(
#                             {'message': f"Turma com id {turma_id} não encontrada ou não associada ao curso."},
#                             status=status.HTTP_404_NOT_FOUND
#                         )
#                 else:
#                     # Se a turma não tem id, cria uma nova
#                     turma_data['curso'] = updated_curso  # Associa a turma ao curso
#                     Turma.objects.create(**turma_data)  # Cria a nova turma

#             # 2. Remover turmas que não estão mais no payload
#             turmas_to_remove = updated_curso.turmas.exclude(id__in=existing_turmas_ids)
#             turmas_to_remove.delete()  # Exclui as turmas que não estão mais associadas ao curso

#         # Retorna a resposta de sucesso
#         return Response({'id': updated_curso.id, 'message': 'Curso atualizado com sucesso!'}, status=status.HTTP_200_OK)

#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def atualizar_curso(request, curso_id):
    # Extraímos os dados da requisição
    turmas = request.data.get('turmas', [])  # Pega as turmas enviadas
    modalidade = request.data.get('modalidade', None)

    try:
        curso = Curso.objects.get(id=curso_id)  # Busca o curso pelo ID
    except Curso.DoesNotExist:
        return Response({'message': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Atualiza o curso com os dados recebidos
    serializer = CursoSerializer(curso, data=request.data, partial=True)  # partial=True permite atualizar apenas campos específicos

    if serializer.is_valid():
        updated_curso = serializer.save()  # Atualiza o curso

        # Agora lidamos com a atualização das turmas associadas
        if turmas:
            # Para cada turma, vamos verificar se ela precisa ser atualizada, criada ou removida
            existing_turmas_ids = [turma_data.get('id') for turma_data in turmas if turma_data.get('id') is not None]

            # 1. Atualizar ou criar turmas
            for turma_data in turmas:
                turma_id = turma_data.get('id', None)  # Se o id da turma estiver presente

                if turma_id:
                    # Se a turma já existe, atualize-a
                    try:
                        turma = Turma.objects.get(id=turma_id, curso=updated_curso)  # Busca a turma associada ao curso
                        turma.numero = turma_data.get('numero', turma.numero)  # Atualiza o número da turma
                        turma.save()  # Salva a turma
                    except Turma.DoesNotExist:
                        return Response(
                            {'message': f"Turma com id {turma_id} não encontrada ou não associada ao curso."},
                            status=status.HTTP_404_NOT_FOUND
                        )
                else:
                    # Se a turma não tem id, cria uma nova
                    turma_data['curso'] = updated_curso  # Associa a turma ao curso
                    Turma.objects.create(**turma_data)  # Cria a nova turma

            # 2. Remover turmas que não estão mais no payload
            turmas_to_remove = updated_curso.turmas.exclude(id__in=existing_turmas_ids)
            turmas_to_remove.delete()  # Exclui as turmas que não estão mais associadas ao curso

        # Retorna a resposta de sucesso
        return Response({'id': updated_curso.id, 'message': 'Curso atualizado com sucesso!'}, status=status.HTTP_200_OK)

    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)














#VERSAO FUNCIONANDO

# @api_view(['PUT'])
# @permission_classes([GestaoEscolar])
# def atualizar_curso(request, curso_id):
#     # Extraímos os dados da requisição
#     turmas = request.data.get('turmas', [])
#     modalidade = request.data.get('modalidade', None)

#     try:
#         curso = Curso.objects.get(id=curso_id)  # Buscando o curso pelo ID
#     except Curso.DoesNotExist:
#         return Response({'message': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)

#     # Atualiza o curso com os dados recebidos
#     serializer = CursoSerializer(curso, data=request.data)  # partial=True permite atualização de campos específicos

#     if serializer.is_valid():
#         updated_curso = serializer.save()  # Atualiza o curso

#         return Response({'id': updated_curso.id, 'message': 'Curso atualizado com sucesso!'}, status=status.HTTP_200_OK)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)