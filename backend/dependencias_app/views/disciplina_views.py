import uuid
from django.http import Http404
from django.db.models import Q
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.permissoes import *
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from dependencias_app.models.disciplina import Disciplina
from dependencias_app.models.curso import Curso
from dependencias_app.serializers.disciplina_serializer import Disciplina_Serializer
from dependencias_app.serializers.curso_serializer import Curso_Serializer

class DisciplinaPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100

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
    try:
        busca = request.query_params.get('busca', '').strip()
        page_size = request.query_params.get('page_size', 15)

        disciplinas = Disciplina.objects.all()
        
        if busca:
            disciplinas = Disciplina.objects.filter(
                Q(nome__icontains=busca)
            )

        paginator = DisciplinaPagination()
        paginator.page_size = page_size  # Define o tamanho da página recebido na requisição
        result_page = paginator.paginate_queryset(disciplinas, request)
        
        serializer = Disciplina_Serializer(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def buscar_por_curso(request, cursoId, nome):
    try:
        uuid_curso = uuid.UUID(cursoId)

        disciplinas = Disciplina.objects.filter(nome__icontains=nome, cursos__id=uuid_curso)

        print(disciplinas)

        if len(disciplinas) == 0:
            return Response({'disciplinas': []}, status=status.HTTP_200_OK)
        
        serializer = Disciplina_Serializer(disciplinas, context={'request': request}, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def editar_disciplina(request, disciplinaId):
    cursos = request.data.pop('cursos', None)
    data = request.data

    try:
        uuid_disciplina = uuid.UUID(disciplinaId)

        disciplina = get_object_or_404(Disciplina, pk=uuid_disciplina)

        uuid_cursos = []

        for curso in cursos:
            uuid_cursos.append(curso.get('id'))

        data['cursos'] = uuid_cursos
    
        serializer = Disciplina_Serializer(disciplina, data=request.data)

        if not serializer.is_valid(): raise serializers.ValidationError(serializer.errors)

        serializer.save()
        return Response({'mensagem': 'Disciplina registrada com sucesso!'}, status=status.HTTP_200_OK)
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
