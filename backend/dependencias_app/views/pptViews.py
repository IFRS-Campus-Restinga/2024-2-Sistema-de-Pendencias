from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
import logging

from dependencias_app.serializers.pptSerializer import PPTSerializer
from dependencias_app.permissoes import GestaoEscolar
from dependencias_app.models.ppt import PPT

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_ppt(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data
        print(request.data)

        serializer = PPTSerializer(data=data)
        
        if serializer.is_valid():
            # Salvar o novo objeto PPT
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=400)