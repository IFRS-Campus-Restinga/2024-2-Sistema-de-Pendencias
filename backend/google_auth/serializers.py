from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

# Classe responsável por validar os dados do modelo User durante o processo de registro de um novo usuário.
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Especifica que o modelo a ser utilizado é o modelo User padrão do django.
        fields = ['username', 'email', 'password']  # Define os campos que serão incluídos na serialização.

# Classe que lida com os dados de autenticação.
class AuthSerializer(serializers.Serializer):
    code = serializers.CharField(required=False)  # Campo para armazenar um código de autenticação.
    error = serializers.CharField(required=False)  # Campo para armazenar mensagens de erro.