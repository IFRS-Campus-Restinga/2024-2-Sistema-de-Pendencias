import uuid
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework import serializers
from ..models.custom_user import CustomUser
from ..serializers.usuario_serializer import CustomUserSerializer
from rest_framework.pagination import PageNumberPagination

class CustomUserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'tam_pagina'
    max_page_size = 30

class CustomUserService:
    @staticmethod
    def criar(data):
        group = Group.objects.get(uuid_map__uuid=uuid.UUID(data.get('group')))

        data['group'] = group.id

        serializer = CustomUserSerializer(data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def listar(request) -> list:
        busca = request.GET.get('busca', None)
        perfil = request.GET.get('perfil', None)
        pagina = request.GET.get('pagina', None)

        dados_hub = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/access_profile/{perfil}/',
            params={
                'fields': 'id, username, email',
                'page': pagina,
                'active': 'true',
                'search': busca
            },
            cookies={
                'system': settings.API_KEY
            }
        ).json()

        if dados_hub.get('count') == 0:
            paginator = CustomUserPagination()
            page = paginator.paginate_queryset([], request)
            return paginator.get_paginated_response(page)

        resultados = dados_hub.get('results', None)

        lista_usuarios = CustomUser.objects.filter(id__in=[uuid.UUID(usuario['id']) for usuario in resultados])

        lista_final = []

        for usuario in lista_usuarios:
            for hub_usuario in resultados:
                if hub_usuario['id'] == str(usuario.id):
                    hub_usuario['group'] = usuario.group.name
                    lista_final.append(hub_usuario)

        paginator = CustomUserPagination()
        resultado = paginator.paginate_queryset(lista_final, request)

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

        usuario = get_object_or_404(CustomUser, pk=uuid.UUID(usuario_hub.get('id')))

        usuario_hub['group'] = str(usuario.group.uuid_map.uuid)

        return usuario_hub


    @staticmethod
    def obter_dados(user_id: str):
        user = get_object_or_404(CustomUser, pk=uuid.UUID(user_id))

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
        usuario = get_object_or_404(CustomUser, pk=uuid.UUID(usuario_id))
        grupo = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(data.get('group')))

        data['group'] = grupo.id

        serializer = CustomUserSerializer(instance=usuario, data=data)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()
