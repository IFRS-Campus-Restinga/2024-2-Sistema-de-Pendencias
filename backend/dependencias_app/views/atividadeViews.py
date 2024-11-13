from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import *
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.atividadeSerializer import *
from dependencias_app.permissoes import Professor

@api_view(['POST'])
@permission_classes([Professor])
def listar_atividades(request, pedId):
    try:
        ped = PED_EMI.objects.get(id=pedId)

        if isinstance(ped, PED_EMI):
            atividades = Atividade_EMI.objects.filter(ped=ped.id)

            atividades_serializer = Atividade_EMI_Serializer(atividades, many=True)

            return Response(atividades_serializer.data, status=status.HTTP_200_OK)
        else:
            ped = PED_ProEJA.objects.filter(ped=ped.id)

            if isinstance(ped, PED_ProEJA):
                atividades = Atividade_ProEJA.objects.filter(ped=ped.id)

                atividades_serializer = Atividade_ProEJA_Serializer(atividades, many=True)

                return Response(atividades_serializer.data, status=status.HTTP_200_OK)
            else:
                raise Exception('PED não encontrada')
        
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)