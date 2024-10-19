from django.urls import path
from dependencias_app.views import teste
# from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews
from dependencias_app.views import disciplinaViews
from dependencias_app.views import servidorViews
from dependencias_app.views.servidorViews import deletar_servidor
from dependencias_app.views import gestaoEscolarViews


from dependencias_app.views import turmaViews
#from dependencias_app.views import listarTurmasViews
from dependencias_app.views import registroEscolarViews
from dependencias_app.views import coordenadorViews

urlpatterns = [
    path('teste', teste.view_teste),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),
    path('cadastrar-turma/', turmaViews.cadastrar_turma),
    path('cadastrar-gestao-escolar/', gestaoEscolarViews.cadastrar_gestao_escolar),
    path('cadastrar-registro-escolar/', registroEscolarViews.cadastrar_registro_escolar),
    path('cadastrar-coordenador/', coordenadorViews.cadastrarCoordenador),
    path('status', teste.get_status),

# URLS Disciplinas
    path('disciplina/create/', disciplinaViews.create_disciplina, name='create_disciplina'),  # Criar uma Disciplina
    path('disciplina/list/', disciplinaViews.list_disciplinas, name='list_disciplinas'),  # Listar todas as disciplinas
    path('disciplina/<int:id>/', disciplinaViews.get_disciplina, name='get_disciplina'),  # Ler uma unica Disciplina
    path('disciplina/<int:id>/update/', disciplinaViews.update_disciplina, name='update_disciplina'),  # Atualizar uma Disciplina
    path('disciplina/<int:id>/delete/', disciplinaViews.delete_disciplina, name='delete_disciplina'),  # Deletar uma Disciplina


    path('listar-servidores/', servidorViews.listar_servidores, name='listar_servidores'),
    path('deletar-servidor/<int:id>/', deletar_servidor, name='deletar_servidor'),


    path('listar-turmas/', turmaViews.listar_turmas, name='listar_turmas'),
    path('listar-cursos/', cursoViews.listar_cursos, name='listar_cursos'),
]
