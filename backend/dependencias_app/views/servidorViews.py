from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dependencias_app.models.gestaoEscolar import GestaoEscolar
from dependencias_app.models.registroEscolar import RegistroEscolar
from dependencias_app.models.coordenador import Coordenador
from dependencias_app.models.professor import Professor
from dependencias_app.serializers.gestaoEscolarSerializer import GestaoEscolarSerializer
from dependencias_app.serializers.registroEscolarSerializer import RegistroEscolarSerializer
from dependencias_app.serializers.coordenadorSerializer import CoordenadorSerializer
from dependencias_app.serializers.professorSerializer import ProfessorSerializer

@api_view(['GET'])
def listar_servidores(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        # Listando e filtrando os dados
        gestao_escolar = GestaoEscolar.objects.all()
        registro_escolar = RegistroEscolar.objects.all()
        coordenadores = Coordenador.objects.all()
        professores = Professor.objects.all()

        if data_inicio and data_fim:
            gestao_escolar = gestao_escolar.filter(data_ingresso__range=[data_inicio, data_fim])
            registro_escolar = registro_escolar.filter(data_ingresso__range=[data_inicio, data_fim])
            coordenadores = coordenadores.filter(data_ingresso__range=[data_inicio, data_fim])
            professores = professores.filter(data_ingresso__range=[data_inicio, data_fim])

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['perfil', 'nome', 'matricula']:
            gestao_escolar = gestao_escolar.order_by(ordenar_por)
            registro_escolar = registro_escolar.order_by(ordenar_por)
            coordenadores = coordenadores.order_by(ordenar_por)
            professores = professores.order_by(ordenar_por)

        # Serialização dos dados
        gestao_serializer = GestaoEscolarSerializer(gestao_escolar, many=True)
        registro_serializer = RegistroEscolarSerializer(registro_escolar, many=True)
        coordenador_serializer = CoordenadorSerializer(coordenadores, many=True)
        professor_serializer = ProfessorSerializer(professores, many=True)

        # Unir todos os dados em uma lista
        servidores = {
            'gestao_escolar': gestao_serializer.data,
            'registro_escolar': registro_serializer.data,
            'coordenadores': coordenador_serializer.data,
            'professores': professor_serializer.data,
        }

        return Response(servidores, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
