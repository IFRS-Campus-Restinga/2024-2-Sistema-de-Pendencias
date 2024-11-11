from rest_framework.views import APIView 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import AtividadePED_EMI, AtividadePED_ProEJA
from dependencias_app.serializers.atividadeSerializer import AtividadePED_EMISerializer, AtividadePED_ProEJASerializer
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from rest_framework.permissions import IsAuthenticated
from dependencias_app.permissoes import Professor


@api_view(['GET'])
@permission_classes([Professor])
def listar_atividades(request, ped_tipo, ped_id):
    if ped_tipo == "emi":
        ped = PED_EMI.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED EMI não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Checa se o professor logado é o responsável pela PED
        if ped.professor != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = AtividadePED_EMI.objects.filter(ped_emi=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = AtividadePED_EMISerializer(atividades, many=True)

    elif ped_tipo == "proeja":
        ped = PED_ProEJA.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED ProEJA não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        if ped.professor != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = AtividadePED_ProEJA.objects.filter(ped_proeja=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = AtividadePED_ProEJASerializer(atividades, many=True)

    else:
        return Response({"erro": "Tipo de PED inválido"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_200_OK)