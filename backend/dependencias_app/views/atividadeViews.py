from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import Atividade
from dependencias_app.models.ped import PED
from dependencias_app.serializers.atividadeSerializer import AtividadeSerializer
from rest_framework.permissions import IsAuthenticated
from dependencias_app.permissoes import Professor

@api_view(['GET'])
@permission_classes([Professor])
def listar_atividades(request, ped_id):
    # Busca o PED pelo ID
    ped = PED.objects.filter(id=ped_id).first()
    if not ped:
        return Response({"erro": "PED não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Checa se o professor logado é o responsável pela PED
    if ped.professor != request.user:
        return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)

    # Filtra atividades relacionadas ao PED
    atividades = Atividade.objects.filter(ped=ped)

    # Adiciona o aluno do PED a cada atividade para o serializer (caso necessário)
    for atividade in atividades:
        atividade.aluno = ped.aluno

    serializer = AtividadeSerializer(atividades, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)