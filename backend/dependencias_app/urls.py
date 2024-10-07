from django.urls import path
from dependencias_app.views import teste
from dependencias_app.views import csrf_token
from dependencias_app.views import alunoViews

urlpatterns = [
    path('teste', teste.view_teste),
    path('auth/csrf_token', csrf_token.csrf_token_view),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno, name='cadastrar_aluno'),
    path('visualizar-alunos/', alunoViews.visualizar_alunos, name='visualizar_alunos')
]
