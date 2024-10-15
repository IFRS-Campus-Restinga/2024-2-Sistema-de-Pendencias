from django.urls import path
from dependencias_app.views import teste, EmiPedViews
# from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews
from dependencias_app.views import registroEscolarViews, disciplinaViews

urlpatterns = [
    path('teste', teste.view_teste),
    # path('cadastrar-servidor', servidorViews.cadastrar_servidor),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),
    path('listar-curso/', cursoViews.visualizar_cursos),
    path('cadastrar-registro-escolar/', registroEscolarViews.cadastrar_registro_escolar),
    path('status', teste.get_status),

    path('cadastrar_disciplina/', disciplinaViews.cadastrar_disciplina, name='cadastrar_disciplina'),
    path('buscar_disciplinas/', disciplinaViews.listar_disciplinas, name='listar_disciplinas'),
    path('buscar_disciplina/<int:id>/', disciplinaViews.buscar_disciplina, name='buscar_disciplina'),

    path('cadastrar_emi_ped/', EmiPedViews.cadastrar_emi_ped, name='cadastrar_emi_ped'),
]
