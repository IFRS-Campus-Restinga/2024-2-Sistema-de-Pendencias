import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings

@api_view(['GET'])
def buscar_usuario(request, grupo):
    try:
        res = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/group/{grupo}/',
            params={
                'search': request.GET.get('search', ''),
                'active': request.GET.get('active'),
                'data_format': request.GET.get('data_format'),
                'page': request.GET.get('page')
            },
            cookies={
                'system': settings.SYSTEM_ID
            } 
        )

        try:
            data = res.json()
        except ValueError:
            data = {'content': res.text, 'status_code': res.status_code}

        return Response(data, status=res.status_code)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
