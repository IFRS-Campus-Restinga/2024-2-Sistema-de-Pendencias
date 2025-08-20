import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from dependencias_session.services.token_service import TokenService

@api_view(['GET'])
def obter_tokens(request):
    system = request.GET.get('system')
    user = request.GET.get('user')

    try:
        r = requests.get(
            f'{settings.BASE_SYSTEM_URL}/session/token/pair-token/',
            params={'system': system, 'user': user}
        )

        if r.status_code != 200:
            return Response(r.json(), status=r.status_code)

        access_token = r.json().get('access')
        refresh_token = r.json().get('refresh')

        user_data_response = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/users/data/',
            cookies={
                'access_token': access_token,
                'system': settings.SYSTEM_ID
            }
        )

        response = Response(user_data_response.json(), status=user_data_response.status_code)

        # Se tokens existirem, adiciona cookies na resposta
        if access_token and refresh_token:
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
                path='/session/'
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
