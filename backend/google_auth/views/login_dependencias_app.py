from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from google_auth.payLoadJWT import *
from google_auth.models import UsuarioBase
from google_auth.services.decode_token import verify_google_token
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@csrf_exempt
@ensure_csrf_cookie
@permission_classes([AllowAny])
def login_view(request):
    try:
        credential = request.data.get('credential')
        client_id = request.data.get('clientId')
        
        # Verifica se os dados existem na requisição
        if not client_id or not credential:
            return Response({'mensagem': 'Dados inválidos'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodifica a credential recebida (JWT) para obter o email
        user_info = verify_google_token(credential, client_id)

        # Verifica se a decodificação retornou algum erro
        if 'error' in user_info:
            return Response({'mensagem': user_info['error']}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se o email solicitante está cadastrado no sistema
        user = UsuarioBase.objects.get(email=user_info['email'])

        # Atualiza o nome do usuário com os dados da conta Google
        user.first_name = user_info.get('first-name', user.first_name)
        user.last_name = user_info.get('last-name', user.last_name)
        user.save()

        # obtém o token csrf para o usuário
        csrf_token = get_token(request)
        # loga o usuário
        login(request, user)
        # obtém o session_id do usuário
        session_id = request.session.session_key

        # Cria um token com um payload personalizado (id, primeiro e ultimo nome além do grupo)
        refresh = CustomPayLoad.get_token(user)
        access = str(refresh.access_token)

        response_data = {
            'mensagem': 'Login efetuado com sucesso!',
            'token': access,  # Token de acesso
            'refresh': str(refresh),  # Token de refresh
            'csrftoken': csrf_token,
            'sessionid': session_id,
            'primeiroLogin': user.primeiro_login if user.primeiro_login else None,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except UsuarioBase.DoesNotExist:
        return Response({'mensagem': 'Você necessita possuir um email institucional cadastrado para acessar!'}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        logger.error(f"Erro ao fazer login: {str(e)}")
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@login_required
@api_view(['POST'])
def logout_view(request):
    logout(request)

    return Response(status=status.HTTP_200_OK)

