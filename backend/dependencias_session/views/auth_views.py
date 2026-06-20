from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def logout(request):
    try:
        response = Response({"Sessão encerrada"}, status=status.HTTP_200_OK)

        response.set_cookie(
            httponly=True,
            key=settings.AUTH_COOKIE_NAME,
            value="",
            max_age=0,
            secure=False,
            samesite='Lax',
            path='/'
        )

        response.set_cookie(
            httponly=True,
            key=settings.REFRESH_COOKIE_NAME,
            value="",
            max_age=0,
            secure=False,
            samesite='Lax',
            path='/session'
        )
        
        return response
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
