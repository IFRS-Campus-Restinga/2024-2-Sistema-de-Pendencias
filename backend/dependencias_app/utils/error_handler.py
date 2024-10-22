from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

def handle_view_errors(view_func):
    """
    Decorador para tratamento de erros em views do Django REST Framework.

    Captura ValidationError para retornar respostas 400 e outras exceções para retornar respostas 500.
    """
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



"""
    Uso:
        Para usar este decorador, basta aplicá-lo a uma função de View. 
        ex:

        ```python
        from rest_framework.decorators import api_view

        @api_view(['POST'])
        @handle_view_errors
        def create_resource(request):
            # Lógica para criar um recurso
            
        ```
"""