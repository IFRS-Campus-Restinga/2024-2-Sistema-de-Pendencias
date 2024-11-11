from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.planoEstudosEMISerializer import PlanoEstudos_EMISerializer
from dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.permissoes import *
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([Professor])
def cadastrar_plano_estudos_EMI(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

        # Serializar os dados recebidos
        serializer = PlanoEstudos_EMISerializer(data=data)
        
        if serializer.is_valid():
            # Salvar o novo objeto PlanoEstudoDirigido
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
