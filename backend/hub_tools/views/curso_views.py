import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def listar_cursos(request):
    try:
        res = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/academic/courses/get/',
            params={
                'search': request.GET.get('busca', ''),
                'category': request.GET.get('categoria'),
                'fields': request.GET.get('retorno'),
            },
            cookies={
                'system': settings.API_KEY
            }
        )

        return Response(res.json(), status=res.status_code)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)