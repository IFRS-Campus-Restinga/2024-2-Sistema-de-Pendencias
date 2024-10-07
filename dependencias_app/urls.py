from django.urls import path
from dependencias_app.views import disciplina_view

urlpatterns = [
    # URLS Disciplinas
    path('disciplina/create/', disciplina_view.create_disciplina, name='create_disciplina'),  # Criar uma disciplina
    path('disciplina/list/', disciplina_view.list_disciplinas, name='list_disciplinas'),  # Listar todas as disciplinas
    path('disciplina/<int:id>/', disciplina_view.get_disciplina, name='get_disciplina'),  # Ler uma unica disciplina
    path('disciplina/<int:id>/update/', disciplina_view.update_disciplina, name='update_disciplina'),  # Atualizar uma disciplina
    path('disciplina/<int:id>/delete/', disciplina_view.delete_disciplina, name='delete_disciplina'),  # Deletar uma disciplina
]
