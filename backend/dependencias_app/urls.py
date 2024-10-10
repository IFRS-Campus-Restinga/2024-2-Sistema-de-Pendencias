from django.urls import path
from dependencias_app.views import teste
# from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews
from dependencias_app.views import registroEscolarViews

urlpatterns = [
    path('teste', teste.view_teste),
    # path('cadastrar-servidor', servidorViews.cadastrar_servidor),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),
    path('cadastrar-registro-escolar/', registroEscolarViews.cadastrar_registro_escolar),
    path('status', teste.get_status),
]
