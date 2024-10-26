from google.oauth2 import id_token
from google.auth.transport import requests

def verify_google_token(token, client_id):
    try:
        # Especificar o CLIENT_ID do seu aplicativo Google
        CLIENT_ID = client_id
        # Verificar e decodificar o token JWT
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # O token é válido e as informações do usuário estão presentes
        email = idinfo.get('email')
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')
        picture = idinfo.get('picture')  # Adicionando o campo de foto


        return {
            'email': email,
            'first-name': first_name,
            'picture': picture
        }
    except ValueError as e:  # Valor malformado ou token inválido
        return {'error': str(e)}  # Retorna um dicionário com a mensagem de erro
    except Exception as e:
        return {'error': str(e)}  # Retorna qualquer outro erro


