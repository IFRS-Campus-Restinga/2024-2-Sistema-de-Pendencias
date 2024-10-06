from django.conf import settings
from django.core.exceptions import ValidationError
from urllib.parse import urlencode
from typing import Dict, Any
import requests
from django.contrib.auth.models import User

# URL para obter o token de acesso do Google.
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
# URL para obter as informações do usuário do Google.
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

# Função google_get_access_token:
# Esta função obtém o token de acesso do Google usando o código de autorização e a URI de redirecionamento fornecidos.
def google_get_access_token(code: str, redirect_uri: str) -> str:
    data = {
        'code': code,  # Código de autorização recebido do Google.
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,  # ID do cliente OAuth2 configurado.
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,  # Segredo do cliente OAuth2 configurado.
        'redirect_uri': redirect_uri,  # URI para onde o Google redireciona após a autorização.
        'grant_type': 'authorization_code'  # Tipo de concessão utilizada na solicitação.
    }

    # Faz uma solicitação POST para obter o token de acesso.
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        raise ValidationError('Could not get access token from Google.')  # Levanta um erro se a solicitação falhar.
    
    access_token = response.json()['access_token']  # Extrai o token de acesso da resposta JSON.
    return access_token

# Função google_get_user_info:
# Esta função obtém as informações do usuário do Google usando o token de acesso fornecido.
def google_get_user_info(access_token: str) -> Dict[str, Any]:
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}  # Passa o token de acesso como parâmetro.
    )

    if not response.ok:
        raise ValidationError('Could not get user info from Google.')  # Levanta um erro se a solicitação falhar.
    
    return response.json()  # Retorna as informações do usuário como um dicionário.

# Função get_user_data:
# Esta função processa os dados validados e obtém informações do usuário do Google.
def get_user_data(validated_data):
    domain = settings.BASE_API_URL  # Obtém a URL base da API das configurações.
    redirect_uri = f'{domain}/auth/api/login/google/'  # Define a URI de redirecionamento.

    code = validated_data.get('code')  # Obtém o código de autorização dos dados validados.
    error = validated_data.get('error')  # Obtém qualquer erro dos dados validados.

    # Verifica se houve erro ou se o código não está presente.
    if error or not code:
        params = urlencode({'error': error})  # Codifica os parâmetros de erro.
        return redirect(f'{LOGIN_URL}?{params}')  # Redireciona para a página de login com o erro.

    access_token = google_get_access_token(code=code, redirect_uri=redirect_uri)  # Obtém o token de acesso.
    user_data = google_get_user_info(access_token=access_token)  # Obtém as informações do usuário.

    # Cria ou obtém um usuário no banco de dados usando os dados do Google.
    User.objects.get_or_create(
        username=user_data['email'],  # Usa o email como nome de usuário.
        email=user_data['email'],  # Usa o email como endereço de email.
        first_name=user_data.get('given_name'),  # Obtém o nome dado do usuário.
        last_name=user_data.get('family_name')  # Obtém o sobrenome do usuário.
    )
    
    # Cria um dicionário com os dados do perfil do usuário.
    profile_data = {
        'email': user_data['email'],
        'first_name': user_data.get('given_name'),
        'last_name': user_data.get('family_name'),
    }
    return profile_data  # Retorna os dados do perfil do usuário.
