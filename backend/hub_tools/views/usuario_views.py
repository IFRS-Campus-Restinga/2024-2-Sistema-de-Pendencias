import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings

@api_view(['GET'])
def buscar_usuario(request, perfil):
    try:
        res = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/get/access_profile/{perfil}/',
            params={
                'search': request.GET.get('busca', ''),
                'active': request.GET.get('ativo'),
                'fields': request.GET.get('retorno'),
                'page': request.GET.get('pagina')
            },
            cookies={
                'system': settings.API_KEY
            } 
        )

        try:
            data = res.json()
        except ValueError:
            data = {'content': res.text, 'status_code': res.status_code}

        return Response(data, status=res.status_code)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
