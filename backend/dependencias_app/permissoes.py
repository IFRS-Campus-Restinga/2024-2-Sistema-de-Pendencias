from rest_framework.permissions import BasePermission

class Aluno(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo == 'Aluno'
        return False
    
class Professor(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo == 'Professor'
        return False
    
class Coordenador(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo == 'Coordenador'
        return False
    
class RegistroEscolar(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo == 'RegistroEscolar'
        return False
    
class GestaoEscolar(BasePermission):
    def has_permission(self, request, view):
        print("Usuário:", request.user)  # Para depuração
        if request.user and request.user.is_authenticated:
            # Verifica se o grupo do usuário não é None e se o nome é 'GestaoEscolar'
            if request.user.grupo and request.user.grupo.name == 'GestaoEscolar':
                return True
        return False