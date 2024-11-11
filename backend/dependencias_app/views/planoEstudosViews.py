from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from backend.dependencias_app.serializers.planoEstudosEMISerializer import PlanoEstudos
from backend.dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.permissoes import GestaoEscolar
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_plano_estudo(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

        # Serializar os dados recebidos
        serializer = PlanoEstudos (data=data)
        
        if serializer.is_valid():
            # Salvar o novo objeto PlanoEstudoDirigido
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error("Erro ao cadastrar Plano de Estudo Dirigido: %s", str(e))
        return Response({'mensagem': 'Erro ao processar a solicitação.'}, status=status.HTTP_400_BAD_REQUEST)
