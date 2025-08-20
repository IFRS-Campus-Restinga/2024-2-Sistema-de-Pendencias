import uuid
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Permission, Group
from dependencias_session.serializers.permissao_serializer import PermissaoSerializer
from rest_framework.pagination import PageNumberPagination

class PermissaoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'tam_pagina'
    max_page_size = 30

class PermissaoService:
    @staticmethod
    def listar(request):
        permissions = Permission.objects.all()

        if not permissions.exists():
            paginator = PermissaoPagination()
            paginated_result = paginator.paginate_queryset([], request)
            return paginator.get_paginated_response(paginated_result)
        
        paginator = PermissaoPagination()
        paginated_result = paginator.paginate_queryset(permissions, request)

        serializer = PermissaoSerializer(paginated_result, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
        
    @staticmethod
    def listar_nao_vinculadas(request, group_uuid):
        group = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(group_uuid))
    
        assigned_permissions = group.permissions.all()

        permissions = Permission.objects.exclude(id__in=assigned_permissions.values_list('id', flat=True))

        if not permissions.exists():
            paginator = PermissaoPagination()
            paginated_result = paginator.paginate_queryset([], request)
            return paginator.get_paginated_response(paginated_result)
        
        paginator = PermissaoPagination()
        paginated_result = paginator.paginate_queryset(permissions, request)
        
        serializer = PermissaoSerializer(paginated_result, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data) 
    
    @staticmethod
    def listar_por_grupo(request, group_uuid):
        group = get_object_or_404(Group, uuid_map__uuid=uuid.UUID(group_uuid))

        permissions = group.permissions.all()

        if not permissions.exists():
            paginator = PermissaoPagination()
            paginated_result = paginator.paginate_queryset([], request)
            return paginator.get_paginated_response(paginated_result)
        
        paginator = PermissaoPagination()
        paginated_result = paginator.paginate_queryset(permissions, request)

        serializer = PermissaoSerializer(paginated_result, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data) 
    