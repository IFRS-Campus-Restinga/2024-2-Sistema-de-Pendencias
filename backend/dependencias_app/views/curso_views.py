import uuid
from django.shortcuts import *
from django.db.models import Q
from django.http import Http404
from dependencias_app.permissoes import *
from dependencias_app.serializers.curso_serializer import Curso_Serializer
from dependencias_app.serializers.turma_serializer import Turma_Serializer
from dependencias_app.models.curso import Curso
from dependencias_app.models.turma import Turma
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.pagination import PageNumberPagination

class CursoPaginatio (PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100 

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_curso(request):
    try:
        turmas = request.data.pop('turmas', [])
        data = request.data

        if data.get('modalidade') == 'Integrado' and not turmas:
            raise serializers.ValidationError('Os cursos de modalidade Integrado devem possuir turmas cadastradas.')

        serializer_curso = Curso_Serializer(data=data)

        if not serializer_curso.is_valid():
            raise serializers.ValidationError(serializer_curso.errors)

        serializer_curso.save()

        if serializer_curso.instance.modalidade == 'Integrado':
            for turma in turmas:
                turma['curso'] = str(serializer_curso.instance.id)
                serializer_turma = Turma_Serializer(data=turma)

                if not serializer_turma.is_valid():
                    raise serializers.ValidationError(serializer_turma.errors)

                serializer_turma.save()

        return Response({'message': 'Curso cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
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
def listar_cursos(request):
    try:
        busca = request.query_params.get('busca', '').strip()
        page_size = request.query_params.get('page_size', 15)

        cursos = Curso.objects.all()
        
        if busca:
            cursos = Curso.objects.filter(
                Q(nome__icontains=busca) |
                Q(coordenador__email__icontains=busca)
            )

        # Paginação
        paginator = CursoPaginatio ()
        paginator.page_size = page_size  # Define o tamanho da página recebido na requisição
        result_page = paginator.paginate_queryset(cursos, request)
        
        serializer = Curso_Serializer(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_por_modalidade(request, modalidade):
    try:
        cursos = Curso.objects.filter(modalidade=modalidade)

        serializer = Curso_Serializer(cursos, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def obter_curso(request, cursoId):
    try:
        uuid_curso = uuid.UUID(cursoId)

        curso = get_object_or_404(Curso, pk=uuid_curso)
        serializer = Curso_Serializer(curso, context={'request': request}) 

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Curso.DoesNotExist:
        return Response({'mensagem': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_curso(request, cursoId):
    turmas = request.data.pop('turmas', [])  # Pega as turmas enviadas

    try:
        data = request.data

        if (data['modalidade'] == 'Integrado' and turmas == []): 
            raise serializers.ValidationError('Os cursos de modalidade Integrado devem possuir turmas cadastradas')
        elif (data['modalidade'] == 'ProEJA' and turmas != []):
            raise serializers.ValidationError('Os cursos da modalidade ProEJA não devem possuir turmas')
        
        uuid_curso = uuid.UUID(cursoId)
        curso = get_object_or_404(Curso, pk=uuid_curso)

        if curso.modalidade == 'Integrado' and data['modalidade'] == 'ProEJA':
            Turma.objects.filter(curso=curso).delete()

        serializer_curso = Curso_Serializer(curso, data=data)

        if not serializer_curso.is_valid(): raise serializers.ValidationError(serializer_curso.errors)

        serializer_curso.save()

        for nova_turma in turmas:
            nova_turma['curso'] = curso.id
            turma_id = nova_turma.get('id', None)

            if turma_id:
                uuid_turma = uuid.UUID(nova_turma.get('id', None))
                turma = get_object_or_404(Turma, pk=uuid_turma)

                serializer_turma = Turma_Serializer(turma, data=nova_turma)
            else:
                serializer_turma = Turma_Serializer(data=nova_turma)

            if not serializer_turma.is_valid(): raise serializers.ValidationError(serializer_turma.errors)
            
            serializer_turma.save()

        return Response({'mensagem': 'Curso atualizado com sucesso'}, status=status.HTTP_200_OK)
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
    
