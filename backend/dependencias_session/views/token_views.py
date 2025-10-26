from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..services.token_service import TokenService, TokenValidationError
from dependencias_app.services.usuario_service import UsuarioService
from jwt.exceptions import InvalidTokenError


@api_view(['GET'])
def obter_tokens(request):
    user = request.GET.get('user')

    try:
        access_token, refresh_token = TokenService.pair_token(user)
        user_data = UsuarioService.obter_dados(user)

        response = Response(user_data, status=status.HTTP_200_OK)

        response.set_cookie(
            httponly=True,
            key='access_token',
            value=access_token,
            secure=False,
            samesite='Lax',
            path='/'
        )

        response.set_cookie(
            httponly=True,
            key='refresh_token',
            value=refresh_token,
            secure=False,
            samesite='Lax',
            path='/session'
        )
        
        return response
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except (InvalidTokenError, KeyError, TypeError, ValueError, TokenValidationError) as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def renovar_token(request):
    refresh_token = request.COOKIES.get('refresh_token', None)

    try:
        access_token = TokenService.refresh_token(refresh_token)

        response = Response({'message': 'Token renovado com sucesso'},status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/'
        )
        
        return response
    except Http404 as e:
        return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except (InvalidTokenError, KeyError, TypeError, ValueError, TokenValidationError) as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
