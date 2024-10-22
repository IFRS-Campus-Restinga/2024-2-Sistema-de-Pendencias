from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from google_auth.payLoadJWT import *
from google_auth.models import UsuarioBase
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
        
        # Verifica se os dados existem na requisição
        if not client_id or not access_token:
            return Response({'mensagem': 'Dados inválidos'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodifica a credential recebida (JWT) para obter o email
        user_info = verify_google_token(access_token, client_id)

        # Verifica se a decodificação retornou erro ou None
        if user_info is None:
            return Response({'mensagem': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se o email solicitante está cadastrado no sistema
        try:
            user = UsuarioBase.objects.get(email=user_info.get('email'))
        except UsuarioBase.DoesNotExist:
            return Response({'mensagem': 'Você necessita possuir um email institucional cadastrado para acessar!'}, status=status.HTTP_403_FORBIDDEN)

        # Atualiza o nome do usuário com os dados da conta Google
        user.first_name = user_info.get('first-name', user.first_name)
        user.last_name = user_info.get('last-name', user.last_name)
        user.save()

        # loga o usuário
        login(request, user)

        # Cria um token com um payload personalizado (id, primeiro e ultimo nome além do grupo)
        refresh = CustomPayLoad.get_token(user)
        access = str(refresh.access_token)

        response_data = {
            'mensagem': 'Login efetuado com sucesso!',
            'token': access,  # Token de acesso
            'fotoPerfil': user_info.get('picture'),  # Use .get para evitar KeyError
            'primeiroLogin': user.primeiro_login if user.primeiro_login else None,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Erro ao fazer login: {str(e)}")
        return Response({'mensagem': 'Erro ao realizar login. Tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)
    
@login_required
@api_view(['POST'])
def logout_view(request):
    logout(request)

    return Response(status=status.HTTP_200_OK)

