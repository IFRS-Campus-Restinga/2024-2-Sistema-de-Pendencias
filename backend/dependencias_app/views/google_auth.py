from django.http import HttpResponse
from dependencias_app.models.aluno import Aluno
from django.shortcuts import render, get_object_or_404, redirect, render
from django.contrib.auth import login, logout
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from dependencias_app.serializers import AuthSerializer
from dependencias_app.services import get_user_data
from django.contrib.auth.models import User

# Classe GoogleLoginApi: 
# Esta classe é responsável por gerenciar a autenticação de usuários via Google. Ela herda de APIView, permitindo a criação de endpoints de API.
class GoogleLoginApi(APIView):
    def get(self, request, *args, **kwargs):
        # Cria uma instância do AuthSerializer com os dados da requisição GET.
        auth_serializer = AuthSerializer(data=request.GET)
        # Valida os dados do serializer e levanta uma exceção se a validação falhar.
        auth_serializer.is_valid(raise_exception=True)
        
        # Obtém os dados validados do serializer.
        validated_data = auth_serializer.validated_data
        # Chama a função get_user_data para obter as informações do usuário.
        user_data = get_user_data(validated_data)
        
        # Busca o usuário no banco de dados pelo email obtido.
        user = User.objects.get(email=user_data['email'])
        # Faz login do usuário na sessão atual.
        login(request, user)

        # Redireciona para a URL base da aplicação.
        return redirect(settings.BASE_APP_URL) #(precisa ser mudado futuramente)

# Classe LogoutApi:
# Esta classe gerencia o logout do usuário. Também herda de APIView para permitir o uso como um endpoint de API.
class LogoutApi(APIView):
    def get(self, request, *args, **kwargs):
        # Realiza o logout do usuário atual. (falta concluir implementação)
        logout(request)
        # Retorna uma resposta HTTP com o status 200 (OK).
        return HttpResponse('200')
