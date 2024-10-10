from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.aluno import Aluno
from dependencias_app.serializers.alunoSerializer import AlunoSerializer
from django.contrib.auth.models import User


@api_view(['POST'])
def cadastrar_aluno(request):
    email = request.data.get('email', None)
    serializer = AlunoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        User.objects.create(email=email)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def visualizar_alunos(request):
    alunos = Aluno.objects.all()
    serializer = AlunoSerializer(alunos, many=True)
    return Response(serializer.data)
