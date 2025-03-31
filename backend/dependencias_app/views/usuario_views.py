import os
import threading
import uuid
from django.db.models import Q
from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import Http404
from google_auth.models import Usuario
from django.contrib.auth.models import Group
from dependencias_app.serializers.usuario_serializer import Usuario_Serializer
from dependencias_app.serializers.grupo_serializer import Grupo_Serializer
from dependencias_app.permissoes import *
from dependencias_app.utils.enviar_email import enviar_email
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.pagination import PageNumberPagination

class UsuarioPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100 

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_usuario (request):
    try:
        data = request.data

        grupo = get_object_or_404(Group, name=data['grupo'])

        data['grupo'] = grupo.id

        serializer = Usuario_Serializer(data=data)

        if not serializer.is_valid(): raise serializers.ValidationError(serializer.errors)

        serializer.save()

        template = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'templates_email',
        'novoUsuario.html'
        )

        threading.Thread(target=enviar_email, args=(serializer.instance, template, 'Boas Vindas ao Sistema de Dependências', serializer.instance.grupo.name)).start()

        return Response(status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        erros = e.detail
        mensagem_erro = erros.get('email', [str(e)])[0]
        return Response({'mensagem': mensagem_erro}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_usuarios_por_perfil(request, perfil):
    try:
        busca = request.query_params.get('busca', '').strip()
        page_size = request.query_params.get('page_size', 15)

        if (perfil == 'servidores'):
            usuarios = Usuario.objects.exclude(grupo__name="Aluno")
        elif (perfil == 'alunos'):
            usuarios = Usuario.objects.filter(grupo__name="Aluno")
        else:
            raise serializers.ValidationError('Perfil de busca inválido')
        
        if busca:
            usuarios = usuarios.filter(
                Q(nome__icontains=busca) |
                Q(email__icontains=busca) |
                Q(grupo__name__icontains=busca)
            )

        # Paginação
        paginator = UsuarioPagination()
        paginator.page_size = page_size  # Define o tamanho da página recebido na requisição
        result_page = paginator.paginate_queryset(usuarios, request)
        
        serializer = Usuario_Serializer(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except serializers.ValidationError as e:
        erros = e.detail
        mensagem_erro = erros.get('email', [str(e)])[0]
        return Response({'mensagem': mensagem_erro}, status=status.HTTP_400_BAD_REQUEST)
    except Http404 as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Coordenador | Professor | Aluno])
def get_infos_usuario(request, idUsuario):
    try:
        try:
            uuid_usuario = uuid.UUID(idUsuario)
        except ValueError:
            return Response({'mensagem': 'Formato de ID inválido'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = get_object_or_404(Usuario, pk=uuid_usuario)

        serializer = Usuario_Serializer(usuario, context={'request': request})

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    except Http404:
        return Response({'mensagem': 'Nenhum usuário existente para este ID'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([GestaoEscolar | RegistroEscolar | Professor])
def listar_por_parametro(request, param, grupo):
    try:
        usuarios = Usuario.objects.filter(
            Q(email__icontains=param, grupo__name=grupo) | Q(nome__icontains=param, grupo__name=grupo)
        )

        serializer = Usuario_Serializer(usuarios, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem: ': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listar_grupos(request):
    try:
        grupos = Group.objects.exclude(name='Aluno')

        serializer = Grupo_Serializer(grupos, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar])
def editar_usuario(request, idUsuario):
    try:
        data = request.data

        usuario = get_object_or_404(Usuario, pk=idUsuario)

        serializer = Usuario_Serializer(usuario, data)

        if not serializer.is_valid(): raise serializers.ValidationError(serializer.errors)

        serializer.save()
        return Response({'mensagem': 'Dados do usuário alterados com sucesso!'}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)