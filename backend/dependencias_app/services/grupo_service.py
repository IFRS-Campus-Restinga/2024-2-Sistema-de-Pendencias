import uuid
from django.contrib.auth.models import Group, Permission
from dependencias_app.serializers.grupo_serializer import GrupoSerializer
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

class GrupoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'tam_pagina'
    max_page_size = 30

class GrupoService:
    @staticmethod
    def criar(grupo_data):
        add_permissoes = Permission.objects.filter(uuid_map__uuid__in=[uuid.UUID(perm['id']) for perm in grupo_data.get('addPermissoes')]).values_list('id', flat=True)
        rem_permissoes = Permission.objects.filter(uuid_map__uuid__in=[uuid.UUID(perm['id']) for perm in grupo_data.get('remPermissoes')]).values_list('id', flat=True)

        serializer = GrupoSerializer(data={'name': grupo_data.get('name'), 'permissions_to_add': add_permissoes, 'permissions_to_remove': rem_permissoes})

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def editar(grupo_data, grupo_id: str):
        grupo = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(grupo_id))

        add_permissoes = Permission.objects.filter(uuid_map__uuid__in=[uuid.UUID(perm['id']) for perm in grupo_data.get('addPermissoes')]).values_list('id', flat=True)
        rem_permissoes = Permission.objects.filter(uuid_map__uuid__in=[uuid.UUID(perm['id']) for perm in grupo_data.get('remPermissoes')]).values_list('id', flat=True)

        grupo_name = grupo_data['name']

        serializer = GrupoSerializer(instance=grupo, data={'name': grupo_name, 'permissions_to_add': add_permissoes, 'permissions_to_remove': rem_permissoes})

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()

    @staticmethod
    def listar(request):
        lista_grupos = Group.objects.filter(name__icontains=request.GET.get('param', ''))

        if not lista_grupos.exists():
            return GrupoPagination().get_paginated_response([])
        
        paginator = GrupoPagination()
        resultado_paginado = paginator.paginate_queryset(lista_grupos, request)

        serializer = GrupoSerializer(resultado_paginado, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)

    @staticmethod
    def detalhes(request, grupo_id: str):
        grupo = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(grupo_id))

        serializer = GrupoSerializer(grupo, context={'request': request})

        return serializer.data

    @staticmethod
    def listar_permissoes_por_grupo(nome: str) -> list[str]:
        grupo = get_object_or_404(Group, name=nome)

        return [perm.codename for perm in grupo.permissions.all()]