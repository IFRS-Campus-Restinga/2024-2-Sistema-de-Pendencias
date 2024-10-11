from django.urls import path
from dependencias_app.views import teste
from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews
from dependencias_app.views import disciplinaViews




urlpatterns = [
    path('teste', teste.view_teste),
    path('cadastrar-servidor', servidorViews.cadastrar_servidor),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),
    path('teste', teste.view_teste),

# URLS Disciplinas
    path('disciplina/create/', disciplinaViews.create_disciplina, name='create_disciplina'),  # Criar uma Disciplina
    path('disciplina/list/', disciplinaViews.list_disciplinas, name='list_disciplinas'),  # Listar todas as disciplinas
    path('disciplina/<int:id>/', disciplinaViews.get_disciplina, name='get_disciplina'),  # Ler uma unica Disciplina
    path('disciplina/<int:id>/update/', disciplinaViews.update_disciplina, name='update_disciplina'),  # Atualizar uma Disciplina
    path('disciplina/<int:id>/delete/', disciplinaViews.delete_disciplina, name='delete_disciplina'),  # Deletar uma Disciplina


]
