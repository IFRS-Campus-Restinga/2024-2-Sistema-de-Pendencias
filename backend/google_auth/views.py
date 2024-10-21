from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import AuthSerializer
from google_auth.services import get_user_data
from rest_framework.exceptions import ValidationError
from dependencias_app.models.aluno import *
from dependencias_app.models.professor import *
from dependencias_app.models.coordenador import *
from dependencias_app.models.gestaoEscolar import *
from dependencias_app.models.registroEscolar import *
import asyncio
from asgiref.sync import sync_to_async


@csrf_exempt
@api_view(['POST'])
def google_login(request):
    # Valida o código de autorização do Google recebido na URL.
    auth_serializer = AuthSerializer(data=request.data)
    
    if not auth_serializer.is_valid():
        raise ValidationError(auth_serializer.errors)

    # Obtém os dados validados
    validated_data = auth_serializer.validated_data

    # Usa o código de autorização para obter os dados do usuário do Google
    user_data = get_user_data(validated_data)

    user = userQuery(user_data['email'])

    # Verifica se o usuário com esse email já existe no banco de dados
    # try:
    #     user = User.objects.get(email=user_data['email'])
    # except User.DoesNotExist:
    #     return Response({'mensagem':'Email inválido para login'}, status=403)
        
    # Se o usuário existir ou for criado, autentica e cria a sessão
    # login(request, user)  # Cria a sessão no Django
    token = get_token(request)

    return Response({'Mensagem': 'login concluído com sucesso', 'csrfToken': token, 'user_data': user_data}, status=200) 


# Classe para o logout
def logout(request):
        # Finaliza a sessão do usuário
        
        # Retorna uma resposta indicando que o logout foi bem-sucedido
        return Response(status=200)

async def userQuery(email: str):
    return await asyncio.gather(
         consultaAluno(email=email),
         consultaProfessor(email=email),
         consultaCoordenador(email=email),
         consultaGestao(email=email),
         consultaRegistro(email=email)
    )
    

async def consultaAluno(email: str):
    return await sync_to_async(Aluno.objects.get(email=email))

async def consultaProfessor(email: str):
    return await sync_to_async(Professor.objects.get(email=email))

async def consultaCoordenador(email: str):
    return await sync_to_async(Coordenador.objects.get(email=email))

async def consultaGestao(email: str):
    return await sync_to_async(GestaoEscolar.objects.get(email=email))

async def consultaRegistro(email: str):
    return await sync_to_async(RegistroEscolar.objects.get(email=email))
