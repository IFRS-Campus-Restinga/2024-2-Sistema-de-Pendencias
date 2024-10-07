from django.urls import path
from dependencias_app import views

urlpatterns = [
    # URLS Disciplinas
    path('disciplina/create/', views.create_disciplina, name='create_disciplina'),  # Criar uma disciplina
    path('disciplina/list/', views.list_disciplinas, name='list_disciplinas'),  # Listar todas as disciplinas
    path('disciplina/<int:id>/', views.get_disciplina, name='get_disciplina'),  # Ler uma unica disciplina
    path('disciplina/<int:id>/update/', views.update_disciplina, name='update_disciplina'),  # Atualizar uma disciplina
    path('disciplina/<int:id>/delete/', views.delete_disciplina, name='delete_disciplina'),  # Deletar uma disciplina
]
