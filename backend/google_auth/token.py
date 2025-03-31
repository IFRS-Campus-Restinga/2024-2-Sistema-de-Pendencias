import jwt
from google_auth.models import Usuario
from django.conf import settings

def custom_token(user: Usuario, codFoto: str, nome: str):
    payload = {
        'idUsuario': str(user.id),  # Garante que o UUID seja serializado como string
        'grupo': user.grupo.name,
        'nome': nome,
        'primeiroLogin': user.primeiro_login,
        'fotoPerfil': codFoto
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    return token
