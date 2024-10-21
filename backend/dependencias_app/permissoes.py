from rest_framework.permissions import BasePermission

class Aluno(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo.get(name='Aluno').exists()
        return False
    
class Professor(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo.get(name='Professor').exists()
        return False
    
class Coordenador(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo.get(name='Coordenador').exists()
        return False
    
class RegistroEscolar(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.grupo.get(name='RegistroEscolar').exists()
        return False
    
class GestaoEscolar(BasePermission):
    def has_permission(self, request, view):
        print(request.user)
        if request.user and request.user.is_authenticated:
            return request.user.grupo.get(name='GestaoEscolar').exists()
        return False