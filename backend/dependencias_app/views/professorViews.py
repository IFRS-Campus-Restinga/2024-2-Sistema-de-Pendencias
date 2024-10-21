from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import Group
from dependencias_app.serializers.professorSerializer import ProfessorSerializer
from dependencias_app.models.professor import Professor

@api_view(['GET'])
def listarProfessores(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        professores = Professor.objects.all()

        if data_inicio and data_fim:
            professores = professores.filter(data_ingresso__range=[data_inicio, data_fim])

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['perfil', 'nome', 'matricula']:
            professores = professores.order_by(ordenar_por)

        # Serialização dos dados
        serializer = ProfessorSerializer(professores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)