from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def buscar_notificacoes(request):
    pass

    
@api_view(['POST'])
def trocar_status(request, idNotificacao):
    pass
    