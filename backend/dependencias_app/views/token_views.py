import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

@api_view(['GET'])
def obter_tokens(request):
    system = request.GET.get('system', None)
    user = request.GET.get('user', None)
    try:
        response = requests.get(f'{settings.BASE_SYSTEM_URL}/auth/token/pair-token/', params={'system': system, 'user': user})

        if response.status_code == 200:
            access_token = response.json().get('access')
            refresh_token = response.json().get('refresh')
            user_data = response.json().get('user_data')

            response = Response({'user_data': user_data}, status=status.HTTP_200_OK)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 15,
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 60 * 24,
                path='auth/token/'
            )
    
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    

