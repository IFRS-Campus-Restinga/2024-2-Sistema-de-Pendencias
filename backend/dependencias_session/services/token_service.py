import uuid
import jwt
from django.shortcuts import get_object_or_404
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from dependencias_app.models.usuario import Usuario
from django.conf import settings

class TokenValidationError(Exception):
    pass

class TokenMetadataService:
    @staticmethod
    def get(user: Usuario) -> dict:
        
        return {
            'group': user.group.name,
            'permissions': [perm.codename for perm in user.group.permissions.all().distinct()]
        }
    
class TokenValidationService:
    @staticmethod
    def validate_groups(user: Usuario, token_group: str):
        group = user.group.name

        if not token_group == group:
            raise TokenValidationError("Grupos inválidos")

    @staticmethod
    def validate_permissions(user: Usuario, token_permissions: list[str]):
        permissions = set([perm.codename for perm in user.group.permissions.all()])

        if permissions != token_permissions:
            raise TokenValidationError("Permissões inválidas")

    @staticmethod
    def validate(payload) -> Usuario:
        """Verifica se os dados do token constam no banco de dados"""
        token = payload

        try:
            user_id = uuid.UUID(token["user_id"])
           
            user = get_object_or_404(Usuario, pk=user_id)
            
        except (KeyError, ValueError, TypeError):
            raise TokenValidationError("Usuário inválido no token")
        
        token_group = token['group']
        TokenValidationService.validate_groups(user, token_group)

        token_permissions = set(token.get("permissions", []))
        TokenValidationService.validate_permissions(user, token_permissions)
        
        return user

class TokenService:
    @staticmethod
    def pair_token(user: str | Usuario) -> tuple[str, str, Usuario]:        
        now = datetime.now(timezone.utc)        
        refresh_exp = now + timedelta(days=7)

        if not isinstance(user, Usuario):
            user = get_object_or_404(Usuario, pk=uuid.UUID(user))

            refresh_exp = now + timedelta(days=1)
        
        metadata = TokenMetadataService.get(user)

        access_payload = {
            'iat': now,
            'exp': now + timedelta(minutes=5),
            'user_id': str(user.id),
            **metadata,
        }

        refresh_payload = {
            'iat': now,
            'exp': refresh_exp,
            'user_id': str(user.id),
            **metadata,
        }

        access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm="HS256")
        refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")

        return str(access_token), str(refresh_token)

    @staticmethod
    def refresh_token(refresh_token: str) -> tuple[str, Usuario]:
        """Cria um JWT assinado com a `secret_key` do sistema de destino."""
        
        secret = settings.SECRET_KEY
        payload = TokenService.decode_token(refresh_token)
        
        TokenValidationService.validate(payload)

        now = datetime.now(timezone.utc)
        exp = now + timedelta(minutes=5)

        token_payload = {
            'iat': now,
            'exp': exp,
            **payload,
        }

        access_token = jwt.encode(token_payload, secret, algorithm='HS256')

        return access_token

    @staticmethod
    def decode_token(token: str):
        """Decodifica o refresh_token recebido, retornando o payload"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            return payload
        except InvalidTokenError as e:
            raise ValueError("Token inválido ou chave inválida.") from e