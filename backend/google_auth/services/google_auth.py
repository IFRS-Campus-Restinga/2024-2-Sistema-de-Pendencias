from backend.settings import *
import logging
from django.core.exceptions import ValidationError
from urllib.parse import urlencode
from typing import Dict, Any
from django.shortcuts import redirect
import requests
import logging

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)

# URLs para obter o token de acesso e as informações do usuário do Google
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'


def google_get_access_token(code: str, redirect_uri: str) -> str:
    #Obtém o token de acesso do Google usando o código de autorização.

    # Dados necessários para fazer a solicitação ao Google para obter o token de acesso
    data = {
        'code': code,
        'client_id': GOOGLE_OAUTH2_CLIENT_ID,  # O ID do cliente
        'client_secret': GOOGLE_OAUTH2_CLIENT_SECRET,  # O segredo do cliente
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    # faz a solicitação ao Google para obter o token de acesso
    response = requests.post(url=GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    # verifica se a resposta foi bem-sucedida
    if response.status_code != 200:
        raise ValidationError(f'{response.text}')  # caso não seja levanta um erro
    
    # retorna o token de acesso
    access_token = response.json().get('access_token', None)
    return access_token


def google_get_user_info(access_token: str) -> Dict[str, Any]:
    #Obtém as informações do usuário a partir do token de acesso do Google.

    # Faz a solicitação ao Google para obter as informações do usuário
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}  # Passa o token de acesso como parâmetro
    )

    # Verifica se a resposta foi bem-sucedida
    if not response.status_code == 200:
        raise ValidationError('Could not get user info from Google.')  # Se falhar, levanta um erro de validação
    
    # Retorna as informações do usuário como um dicionário
    return response.json()


def get_user_data(validated_data):
    #Processa os dados de autorização e obtém as informações do usuário autenticado via Google.

    # Define a URI de redirecionamento
    domain = BASE_API_URL
    redirect_uri = f'{BASE_API_URL}auth/api/login/google/'

    # Obtém o código de autorização e qualquer erro dos dados validados
    code = validated_data.get('code')
    error = validated_data.get('error')

    # Se houver um erro, redireciona para a página de login com o erro
    if error or not code:
        params = urlencode({'error': error})
        return redirect(f'{LOGIN_URL}?{params}')
    
    # Obtém o token de acesso usando o código de autorização
    access_token = google_get_access_token(code=code, redirect_uri=redirect_uri)

    # Obtém as informações do usuário usando o token de acesso
    user_data = google_get_user_info(access_token=access_token)

    # Cria o usuário se for o primeiro login
    # User.objects.get_or_create(
    #     username=user_data['email'],
    #     email=user_data['email'],
    #     first_name=user_data.get('given_name'),
    #     last_name=user_data.get('family_name')
    # )
    
    # Cria um dicionário contendo os dados do perfil do usuário
    profile_data = {
        'email': user_data['email'],
        'first_name': user_data.get('given_name'),
        'last_name': user_data.get('family_name'),
    }

    # Retorna os dados do perfil do usuário
    return profile_data











