from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.models import Group
from dependencias_app.models.professor import Professor
from dependencias_app.serializers.usuarioBaseSerializer import UsuarioBaseSerializer
from dependencias_app.serializers.professorSerializer import ProfessorSerializer
from dependencias_app.permissoes import *
from google_auth.models import UsuarioBase

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_professor(request):
    try:
        # extrai o nome do grupo
        nome_grupo = request.data.get('grupo', None)

        # verifica se é válido
        if nome_grupo != 'Professor': raise Exception('Perfil inválido')

        # encontra o grupo
        grupo = Group.objects.get(name=nome_grupo)

        # adiciona o id do grupo aos dados
        data = request.data
        data['grupo'] = grupo.id
        data.pop('perfil',None)


        # valida pelo serializer
        serializer = UsuarioBaseSerializer(data=data)
        
        if not serializer.is_valid(): raise Exception(serializer.errors)

        # salva o novo usuário
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def infos_adicionais_professor (request):
    try:
        # Obter o ID do usuário enviado na requisição
        id = request.data.get('usuario', None)
        usuario = UsuarioBase.objects.get(pk=id)  # Busca o aluno pelo ID do usuário

        # Atualizar os dados do aluno
        serializer_professor = ProfessorSerializer(data=request.data)

        if serializer_professor.is_valid():
            serializer_professor.save()
            return Response(serializer_professor.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer_professor.errors)  # Adicione esta linha para depuração
            raise Exception(serializer_professor.errors)  # Levanta um erro se a validação falhar

    except usuario.DoesNotExist:
        return Response({'mensagem': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([GestaoEscolar])
def listarProfessores(request):
    try:
        # Filtro por data de ingresso
        data_inicio = request.GET.get('data_inicio', None)
        data_fim = request.GET.get('data_fim', None)
        
        professores = UsuarioBase.objects.filter(grupo__name='Professor').select_related('professor')

        if data_inicio and data_fim:
            professores = professores.filter(data_ingresso__range=[data_inicio, data_fim])

        # Ordenação
        ordenar_por = request.GET.get('ordenar_por', None)
        if ordenar_por in ['perfil', 'first_name', 'last_name']:
            professores = professores.order_by(ordenar_por)
        elif ordenar_por in ['matricula', 'cpf']:
            professores = professores.order_by(f'professor__{ordenar_por}')

        # Serialização dos dados
        serializer = UsuarioBaseSerializer(professores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)