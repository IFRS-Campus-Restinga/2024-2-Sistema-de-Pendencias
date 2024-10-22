import jwt
from google_auth.models import UsuarioBase
from django.conf import settings

def custom_token(user: UsuarioBase):
    payload = {
        'idUsuario': user.pk,
        'perfil': user.grupo.name,
        'primeiroNome': user.first_name,
        'ultimoNome': user.last_name,
    }

    token = jwt.encode(payload, settings.SECRET_KEY)

    return token