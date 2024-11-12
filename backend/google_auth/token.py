import jwt
from google_auth.models import UsuarioBase
from django.conf import settings

def custom_token(user: UsuarioBase, codFoto: str, nome: str):
    payload = {
        'idUsuario': user.pk,
        'grupo': user.grupo.name,
        'nome': nome,
        'primeiroLogin': user.primeiro_login,
        'fotoPerfil': codFoto
    }

    token = jwt.encode(payload, settings.SECRET_KEY)

    return token