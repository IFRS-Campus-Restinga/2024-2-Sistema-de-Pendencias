from rest_framework.permissions import BasePermission

# classe geral de permissão
class GrupoPermission(BasePermission):
    def __init__(self, grupo_nome):
        self.grupo_nome = grupo_nome

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo and request.user.grupo.name == self.grupo_nome
        return False

class Aluno(GrupoPermission):
    def __init__(self):
        super().__init__('Aluno')

class Professor(GrupoPermission):
    def __init__(self):
        super().__init__('Professor')

class Coordenador(GrupoPermission):
    def __init__(self):
        super().__init__('Coordenador')

class RegistroEscolar(GrupoPermission):
    def __init__(self):
        super().__init__('RegistroEscolar')

class GestaoEscolar(GrupoPermission):
    def __init__(self):
        super().__init__('GestaoEscolar')

# classe que combina permissões, para quando mais de um perfil tiver acesso à mesma view
class Or(BasePermission):
    def __init__(self, *permissions):
        self.permissions = permissions

    def has_permission(self, request, view):
        return any(permission().has_permission(request, view) for permission in self.permissions)