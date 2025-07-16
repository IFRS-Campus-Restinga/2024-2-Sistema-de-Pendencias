import jwt
from django.conf import settings
from dependencias_app.services.grupo_service import GrupoService

class TokenService:
    @staticmethod
    def decode(token):
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    
    @staticmethod
    def adicionar_permissoes(token: str) -> str:
        payload = TokenService.decode(token)
        
        grupos_payload = payload.get('groups', [])
        permissoes_payload = payload.get('permissions', [])

        permissoes = set(permissoes_payload)

        for grupo in grupos_payload:
            permissoes_do_grupo = GrupoService.listar_permissoes_por_grupo(grupo)
            permissoes.update(permissoes_do_grupo)

        payload['permissions'] = list(permissoes)

        novo_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return novo_token


        

