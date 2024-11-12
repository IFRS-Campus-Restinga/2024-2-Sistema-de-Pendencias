from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudosSerializer
from backend.dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.permissoes import GestaoEscolar
from dependencias_app.permissoes import Professor
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def cadastrar_plano_estudo(request):
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

        # Usando o serializer correspondente (substitua "PlanoEstudos" por seu serializer real)
        serializer = PlanoEstudosSerializer(data=data)  # Assumindo que o nome do serializer seja PlanoEstudosSerializer
        
        if serializer.is_valid():
            # Salvar o novo objeto PlanoEstudo
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error("Erro ao cadastrar Plano de Estudo Dirigido: %s", str(e))
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
