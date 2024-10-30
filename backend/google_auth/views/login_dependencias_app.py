from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from google_auth.models import UsuarioBase
from google_auth.token import *
from google_auth.services.decode_token import verify_google_token
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

@api_view(['POST'])
@csrf_exempt
@ensure_csrf_cookie
@permission_classes([AllowAny])
def login_view(request):
    try:
        access_token = request.data.get('credential', None)
        client_id = settings.GOOGLE_OAUTH2_CLIENT_ID
        
        if not client_id or not access_token:
            raise Exception('Dados inválidos')

        user_info = verify_google_token(access_token, client_id)

        if user_info is None:
            raise Exception('Token inválido ou expirado')

        user = UsuarioBase.objects.filter(email=user_info['email']).first()
        if not user:
            raise Exception('Você necessita possuir um email institucional cadastrado para acessar!')

        user.first_name = user_info.get('first-name', user.first_name)
        user.save()

        print(user)

        login(request, user)

        pictureCode = user_info.get('picture'),

        token = custom_token(user, pictureCode)

        response_data = {
            'primeiroLogin': user.primeiro_login,
            'token': token
        }

        user.primeiro_login = False
        user.save()

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Erro ao fazer login: {str(e)}")
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@login_required
@api_view(['POST'])
def logout_view(request):
    user = request.user

    user.primeiro_login = False
    user.save()
    
    logout(request)

    return Response(status=status.HTTP_200_OK)

