from django.contrib.auth.models import Group, Permission
from dependencias_app.serializers.grupo_serializer import Grupo_Serializer
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

class GrupoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'pagina'
    max_page_size = 30

class GrupoService:
    @staticmethod
    def criar(nome: str, lista_permissoes: list):
        permissoes = Permission.objects.filter(uuid_map__uuid__in=[perm['id'] for perm in lista_permissoes]).values_list('id', flat=True)

        serializer = Grupo_Serializer(data={'name': nome, 'permissions': permissoes})

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        serializer.save()

    @staticmethod
    def editar(grupo_id: str, nome: str, lista_permissoes: list):
        grupo = get_object_or_404(Group, uuid_map__uuid=grupo_id)

        permissoes = Permission.objects.filter(uuid_map__uuid__in=[perm['id'] for perm in lista_permissoes]).values_list('id', flat=True)

        serializer = Grupo_Serializer(instance=grupo, data={'name': nome, 'permissions': permissoes}, partial=True)

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

        serializer = Grupo_Serializer(resultado_paginado, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)

    @staticmethod
    def detalhes(grupo_id: int, request):
        grupo = get_object_or_404(Group, pk=grupo_id)

        serializer = Grupo_Serializer(data=grupo, context={'request': request})

        return serializer.instance

    @staticmethod
    def listar_permissoes_por_grupo(nome: str) -> list[str]:
        grupo = get_object_or_404(Group, name=nome)

        return [perm.codename for perm in grupo.permissions.all()]