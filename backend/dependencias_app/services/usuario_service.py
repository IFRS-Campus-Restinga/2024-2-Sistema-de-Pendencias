import uuid
import requests
from django.db.models import Q
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework import serializers
from ..models.usuario import Usuario
from ..serializers.usuario_serializer import UsuarioSerializer
from rest_framework.pagination import PageNumberPagination

class UsuarioPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'tam_pagina'
    max_page_size = 30
    page_query_param = 'pagina'

class UsuarioService:
    @staticmethod
    def criar(data):
        group = Group.objects.get(uuid_map__uuid=uuid.UUID(data.get('group')))

        data['group'] = group.id

        serializer = UsuarioSerializer(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()
 
    @staticmethod
    def listar_perfil(request, perfil):
        busca = request.GET.get('busca', None)
        retorno = request.GET.get('retorno', None)
        ultimo_id = request.GET.get('ultimo', None)
        ultimo_created_at = request.GET.get('data_criacao', None)

        paginator = UsuarioPagination()

        # Query base
        if perfil == 'aluno':
            usuarios = Usuario.objects.filter(group__name='aluno')
        else:
            usuarios = Usuario.objects.exclude(group__name='aluno')

        usuarios = usuarios.order_by('-created_at', '-id')

        # Aplica cursor se fornecido
        if ultimo_id and ultimo_created_at:
            usuarios = usuarios.filter(
                Q(created_at__lt=ultimo_created_at) |
                Q(created_at=ultimo_created_at, id__lt=ultimo_id)
            )


        lista_usuarios_hub = []
        for usuario in usuarios:
            if len(lista_usuarios_hub) == paginator.page_size + 1:
                break

            url = f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(usuario.id)}/'
            try:
                response = requests.get(
                    url,
                    params={'fields': retorno},
                    cookies={'system': settings.API_KEY},
                    timeout=10
                )
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                raise Exception(f"Erro ao acessar a API para o usuário {usuario.id}: {e}")

            usuario_hub = response.json()

            # Filtro de busca
            if busca and busca.strip():
                busca_lower = busca.lower()
                if any(busca_lower in str(value).lower() for value in usuario_hub.values() if value is not None):
                    lista_usuarios_hub.append({
                        'id': str(usuario.id),
                        'username': usuario_hub.get('username'),
                        'email': usuario_hub.get('email'),
                        'group': usuario.group.name
                    })
            else:
                lista_usuarios_hub.append({
                    'id': str(usuario.id),
                    'username': usuario_hub.get('username'),
                    'email': usuario_hub.get('email'),
                    'group': usuario.group.name
                })

        resultado = paginator.paginate_queryset(lista_usuarios_hub, request)
        return paginator.get_paginated_response(resultado)

    @staticmethod
    def listar_grupo(request, grupo):
        busca = request.GET.get('busca', None)
        retorno = request.GET.get('retorno', None)

        paginator = UsuarioPagination()

        usuarios = Usuario.objects.filter(group__name=grupo).order_by('-created_at')
        
        lista_usuarios_hub = []
        for usuario in usuarios:
            if len(lista_usuarios_hub) == paginator.page_size:
                break
            else:
                url = f'{settings.BASE_SYSTEM_URL}/api/users/get/{str(usuario.id)}/'
                try:
                    response = requests.get(url, params={'fields': retorno}, cookies={'system': settings.API_KEY}, timeout=10)
                    
                    response.raise_for_status()

                except requests.exceptions.RequestException as e:
                    raise Exception(f"Erro ao acessar a API para o usuário {usuario.id}: {e}")

                usuario_hub = response.json()

                if busca and busca.strip():
                    busca_lower = busca.lower()
                    if any(
                        busca_lower in str(value).lower()
                        for value in usuario_hub.values()
                        if value is not None
                    ):
                        lista_usuarios_hub.append({
                            'id': str(usuario.id),
                            'username': usuario_hub['username'],
                        })
                else:
                    lista_usuarios_hub.append({
                        'id': str(usuario.id),
                        'username': usuario_hub['username'],
                    })

        resultado = paginator.paginate_queryset(lista_usuarios_hub, request)

        return paginator.get_paginated_response(resultado)

    @staticmethod
    def detalhes(usuario_id):
        usuario_hub = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{usuario_id}/',
            params={
                'fields': 'id, username, email',
                'active': 'Ativo'
            },
            cookies={
                'system': settings.API_KEY
            }
        ).json()

        usuario = get_object_or_404(Usuario, pk=uuid.UUID(usuario_hub.get('id')))

        usuario_hub['group'] = str(usuario.group.uuid_map.uuid)

        return usuario_hub

    @staticmethod
    def obter_dados(user_id: str):
        user = get_object_or_404(Usuario, pk=uuid.UUID(user_id))

        user_data = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/{user_id}/', 
            params={
                'fields': 'username'
            },
            cookies={
                'system': settings.API_KEY
            }
        ).json()

        return {
            'id': str(user.id),
            'username': user_data.get('username'),
            'group': user.group.name,
        }
    
    @staticmethod
    def editar(data, usuario_id):
        usuario = get_object_or_404(Usuario, pk=uuid.UUID(usuario_id))
        grupo = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(data.get('group')))

        data['group'] = grupo.id

        serializer = UsuarioSerializer(instance=usuario, data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def criar_aluno(aluno_id):
        aluno = Usuario.objects.filter(id=uuid.UUID(aluno_id))

        if not aluno.exists():
            grupo = Group.objects.get(name="aluno")

            Usuario.objects.create(
                id=uuid.UUID(aluno_id),
                group=grupo
            )
            