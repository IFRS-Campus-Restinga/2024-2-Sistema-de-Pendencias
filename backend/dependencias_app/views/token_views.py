import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from dependencias_app.services.token_service import TokenService

@api_view(['GET'])
def obter_tokens(request):
    system = request.GET.get('system', None)
    user = request.GET.get('user', None)

    try:
        response = requests.get(f'{settings.BASE_SYSTEM_URL}/session/token/pair-token/', params={'system': system, 'user': user})

        if response.status_code == 200:
            access_token = response.json().get('access')
            refresh_token = response.json().get('refresh')

            user_data = requests.get(
                f'{settings.BASE_SYSTEM_URL}/api/user/data/',
                cookies={
                    'access_token': access_token,
                    'system': settings.SYSTEM_ID
                }
            ).json()

            response = Response(user_data, status=status.HTTP_200_OK)

            access_token = TokenService.adicionar_permissoes(access_token)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 60 * 24,
                path='session/'
            )
        
        return response
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def renovar_token(request):
    refresh_token = request.COOKIES.get('refresh_token', None)

    try:
        external_response = requests.get(
            f'{settings.BASE_SYSTEM_URL}/session/token/refresh/',
            cookies={
                'refresh_token': refresh_token,
                'system': settings.SYSTEM_ID
            }
        )

        if external_response.status_code == 200:
            access_token = external_response.json().get('access_token')

            response = Response(status=status.HTTP_200_OK)

            access_token = TokenService.adicionar_permissoes(access_token)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/'
            )
            return response
        else:
            return Response({
                'mensagem': external_response.text
            }, status=external_response.status_code)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
