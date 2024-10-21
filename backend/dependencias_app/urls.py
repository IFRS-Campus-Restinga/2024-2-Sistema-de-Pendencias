from django.urls import path
from dependencias_app.views import teste
# from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews

from dependencias_app.views import disciplinaViews

from dependencias_app.views import turmaViews
#from dependencias_app.views import listarTurmasViews
from dependencias_app.views import registroEscolarViews
from dependencias_app.views import coordenadorViews


urlpatterns = [
    path('teste', teste.view_teste),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),

    path('listar-cursos/', cursoViews.listar_cursos, name='listar_cursos'),

    path('cadastrar-turma/', turmaViews.cadastrar_turma),

    path('cadastrar-registro-escolar/', registroEscolarViews.cadastrar_registro_escolar),
    path('cadastrar-coordenador/', coordenadorViews.cadastrarCoordenador),
    path('status', teste.get_status),

    path('cadastrar-disciplina/', disciplinaViews.cadastrar_disciplina, name='cadastrar_disciplina'),
    path('buscar_disciplinas/', disciplinaViews.listar_disciplinas, name='listar_disciplinas'),
    path('buscar_disciplina/<int:id>/', disciplinaViews.buscar_disciplina, name='buscar_disciplina'),


    ]

