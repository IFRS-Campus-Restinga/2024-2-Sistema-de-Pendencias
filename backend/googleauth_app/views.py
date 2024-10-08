from django.http import HttpResponse
from googleauth_app.serializer import AuthSerializer
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, logout
from django.conf import settings
from rest_framework.views import APIView
from googleauth_app.services import get_user_data
from django.contrib.auth.models import User

# Classe para o login
class GoogleLoginApi(APIView):
    def get(self, request, *args, **kwargs):
        # Valida o código de autorização do Google recebido na URL.
        auth_serializer = AuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)

        # Obtém os dados validados
        validated_data = auth_serializer.validated_data

        # Usa o código de autorização para obter os dados do usuário do Google
        user_data = get_user_data(validated_data)

        # Verifica se o usuário com esse email já existe no banco de dados
        user = User.objects.get(email=user_data['email'])

        # Se o usuário existir ou for criado, autentica e cria a sessão
        login(request, user)  # Cria a sessão no Django

        # Redireciona o usuário para uma URL.
        return redirect(settings.BASE_APP_URL)  # Precisa ser mudado futuramente

# Classe para o logout
class LogoutApi(APIView):
    def get(self, request, *args, **kwargs):
        # Finaliza a sessão do usuário
        logout(request)
        
        # Retorna uma resposta indicando que o logout foi bem-sucedido
        return HttpResponse('200')
