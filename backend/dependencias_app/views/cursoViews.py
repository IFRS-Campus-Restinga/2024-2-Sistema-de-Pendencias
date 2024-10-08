from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from dependencias_app.models.curso import Curso

@csrf_exempt
@api_view(['POST'])
def cadastrar_curso(request):
    nome = request.data.get('nome')
    carga_horaria = request.data.get('carga_horaria')
    modalidade = request.data.get('modalidade')
    
    if not nome or not carga_horaria or not modalidade:
        return Response({'message': 'Dados inválidos'}, status=400)
    
    curso = Curso.objects.create(nome=nome, carga_horaria=carga_horaria, modalidade=modalidade)
    return Response({'message': 'Curso cadastrado com sucesso', 'curso_id': curso.id}, status=201)