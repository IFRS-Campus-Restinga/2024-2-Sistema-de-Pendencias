from rest_framework.decorators import api_view
from fs_auth_middleware.decorators import has_every_permission, has_any_permission
from rest_framework.response import Response

@api_view(['POST'])
@has_every_permission(['add_group'])
def cadastrar_grupo(request):
    try:
        serializer = 
    except Exception as e:
        return Response({'message': str(e)})