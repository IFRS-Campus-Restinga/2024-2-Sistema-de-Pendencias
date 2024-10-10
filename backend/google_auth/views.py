from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import AuthSerializer
from google_auth.services import get_user_data
from django.contrib.auth.models import User, AbstractBaseUser
from rest_framework.exceptions import ValidationError

@api_view(['GET'])
@csrf_exempt
def google_login(request):
    # Valida o código de autorização do Google recebido na URL.
    auth_serializer = AuthSerializer(data=request.GET)
    
    if not auth_serializer.is_valid():
        raise ValidationError(auth_serializer.errors)

    # Obtém os dados validados
    validated_data = auth_serializer.validated_data

    # Usa o código de autorização para obter os dados do usuário do Google
    user_data = get_user_data(validated_data)

    # Verifica se o usuário com esse email já existe no banco de dados
    try:
        user = User.objects.get(email=user_data['email'])
    except User.DoesNotExist:
        return Response({'mensagem':'Email inválido para login'}, status=403)
        
    # Se o usuário existir ou for criado, autentica e cria a sessão
    login(request, user)  # Cria a sessão no Django
    token = get_token(request)

    return Response({'Mensagem': 'login concluído com sucesso', 'csrfToken': token}, status=200) 


# Classe para o logout
def logout(request):
        # Finaliza a sessão do usuário
        logout(request)
        
        # Retorna uma resposta indicando que o logout foi bem-sucedido
        return Response(status=200)
