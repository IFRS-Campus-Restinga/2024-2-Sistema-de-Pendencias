from django.urls import path
# from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews


from dependencias_app.views import disciplinaViews
from dependencias_app.views.servidorViews import deletar_servidor
from dependencias_app.views import gestaoEscolarViews
from dependencias_app.views import turmaViews
#from dependencias_app.views import listarTurmasViews
from dependencias_app.views import registroEscolarViews
from dependencias_app.views import coordenadorViews
from dependencias_app.views import professorViews
from dependencias_app.views import servidorViews
from dependencias_app.views import eventoCalendarioViews


urlpatterns = [
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('dados-adicionais-aluno/', alunoViews.infos_adicionais_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),

    path('listar-cursos/', cursoViews.listar_cursos, name='listar_cursos'),

    path('cadastrar-turma/', turmaViews.cadastrar_turma),



    path('cadastrar-gestao-escolar/', gestaoEscolarViews.cadastrar_gestao_escolar),

    path('cadastrar-registro-escolar/', registroEscolarViews.cadastrar_registro_escolar),
    path('cadastrar-coordenador/', coordenadorViews.cadastrarCoordenador),
    path('cadastrar-professor/', professorViews.cadastrar_professor),

    path('cadastrar-disciplina/', disciplinaViews.cadastrar_disciplina, name='cadastrar_disciplina'),
    path('buscar_disciplinas/', disciplinaViews.listar_disciplinas, name='listar_disciplinas'),
    path('buscar_disciplina/<int:id>/', disciplinaViews.buscar_disciplina, name='buscar_disciplina'),

    path('listar-servidores/', servidorViews.listar_servidores, name='listar_servidores'),
    path('deletar-servidor/<int:id>/', deletar_servidor, name='deletar_servidor'),

    path('listar-turmas/', turmaViews.listar_turmas, name='listar_turmas'),
    path('listar-cursos/', cursoViews.listar_cursos, name='listar_cursos'),

    path('cadastrar-evento/', eventoCalendarioViews.cadastrar_evento, name='cadastrar_evento'),

    ]


