from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
<<<<<<< HEAD
from dependencias_app.serializers.planoEstudosSerializer import PlanoEstudosSerializer
from backend.dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.permissoes import GestaoEscolar
from dependencias_app.permissoes import Professor
=======
from dependencias_app.serializers.planoEstudosEMISerializer import PlanoEstudos_EMISerializer
from dependencias_app.models.planoEstudosEMI import PlanoEstudos
from dependencias_app.permissoes import *
>>>>>>> 1be5a72945abc07c14a67d966770c1bbb2b1ec82
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
<<<<<<< HEAD
@permission_classes([GestaoEscolar | Professor])
def cadastrar_plano_estudo(request):
=======
@permission_classes([Professor])
def cadastrar_plano_estudos_EMI(request):
>>>>>>> 1be5a72945abc07c14a67d966770c1bbb2b1ec82
    logger.info('Dados recebidos: %s', request.data)
    try:
        data = request.data

<<<<<<< HEAD
        # Usando o serializer correspondente (substitua "PlanoEstudos" por seu serializer real)
        serializer = PlanoEstudosSerializer(data=data)  # Assumindo que o nome do serializer seja PlanoEstudosSerializer
=======
        # Serializar os dados recebidos
        serializer = PlanoEstudos_EMISerializer(data=data)
>>>>>>> 1be5a72945abc07c14a67d966770c1bbb2b1ec82
        
        if serializer.is_valid():
            # Salvar o novo objeto PlanoEstudo
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
<<<<<<< HEAD
        logger.error("Erro ao cadastrar Plano de Estudo Dirigido: %s", str(e))
=======
>>>>>>> 1be5a72945abc07c14a67d966770c1bbb2b1ec82
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
