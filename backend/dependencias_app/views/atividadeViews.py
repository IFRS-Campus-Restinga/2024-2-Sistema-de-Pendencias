from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import *
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.atividadeSerializer import *
from dependencias_app.permissoes import Professor


@api_view(['GET'])
@permission_classes([Professor])
def listar_atividades(request, ped_tipo, ped_id):
    if ped_tipo == "emi":
        ped = PED_EMI.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED EMI não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Checa se o professor logado é o responsável pela PED
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = Atividade_EMI.objects.filter(ped_emi=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = Atividade_EMI_Serializer(atividades, many=True)

    elif ped_tipo == "proeja":
        ped = PED_ProEJA.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED ProEJA não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        if ped.professor != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = Atividade_ProEJA.objects.filter(ped_proeja=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = Atividade_ProEJA_Serializer(atividades, many=True)

    else:
        return Response({"erro": "Tipo de PED inválido"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([Professor])
def atualizar_nota_final(request, ped_tipo, ped_id):
    try:
        nota_final = request.data.get('nota_final')
        if nota_final is None:
            return Response({"erro": "Nota final não fornecida."}, status=status.HTTP_400_BAD_REQUEST)

        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not ped:
            return Response({"erro": "PED não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        ped.nota_final = nota_final
        ped.save()

        return Response({"nota_final": ped.nota_final}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
