from rest_framework.permissions import BasePermission

class Aluno(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'Aluno'
            if request.user.grupo and request.user.grupo.name == 'Aluno':
                return True
        return False
    
class Coordenador(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'Coordenador'
            if request.user.grupo and request.user.grupo.name == 'Coordenador':
                return True
        return False
    
class Coordenador(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'Coordenador'
            if request.user.grupo and request.user.grupo.name == 'Coordenador':
                return True
        return False
    
class RegistroEscolar(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'RegistroEscolar'
            if request.user.grupo and request.user.grupo.name == 'RegistroEscolar':
                return True
        return False
    
class GestaoEscolar(BasePermission):
    def has_permission(self, request, view):
        print(f'{request.user} grupo: {request.user.grupo.name}')
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'GestaoEscolar'
            if request.user.grupo and request.user.grupo.name == 'GestaoEscolar':
                return True
        return False