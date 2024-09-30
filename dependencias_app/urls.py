from django.urls import path
from dependencias_app import views

urlpatterns = [
    path('aluno/create', views.create, name='create_aluno'),
    path('aluno/list', views.list_alunos, name='aluno_list'),
    path('disciplina/creat', views.create_disciplina, name='create_disciplina'),
    path('disciplina/list/', views.list_disciplinas, name='list_disciplinas'),
]
