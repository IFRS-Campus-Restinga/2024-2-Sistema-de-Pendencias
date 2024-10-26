import jwt
from google_auth.models import UsuarioBase
from django.conf import settings

def custom_token(user: UsuarioBase, pictureCode: str):
    payload = {
        'idUsuario': user.pk,
        'perfil': user.grupo.name,
        'primeiroNome': user.first_name,
        'email': user.email,
        'fotoPerfil': pictureCode
    }

    token = jwt.encode(payload, settings.SECRET_KEY)

    return token