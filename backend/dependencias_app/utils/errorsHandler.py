from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def handle_view_errors(view_func):
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        try:
            return view_func(*args, **kwargs)
        except ValidationError as e:
            return Response({
                "error": "Erro de validação",
                "details": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": "Erro inesperado",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper