from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from dependencias_app.serializers.professor_serializer import ProfessorSerializer
from dependencias_app.permissoes import *
from google_auth.models import Usuario

@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def infos_adicionais_professor (request):
    try:
        # Obter o ID do usuário enviado na requisição
        id = request.data.get('usuario', None)
        usuario = Usuario.objects.get(pk=id)  # Busca o aluno pelo ID do usuário

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