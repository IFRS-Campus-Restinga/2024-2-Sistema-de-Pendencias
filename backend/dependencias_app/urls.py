from django.urls import path
from dependencias_app import views

urlpatterns = [
    path('aluno/create', views.create, name='create_aluno'),
    path('aluno/list', views.list_alunos, name='aluno_list'),
    path('cadastrar_servidor/', views.cadastrar_servidor, name='cadastrar_servidor'),
    path('cursos/cadastro_curso', views.cadastro_curso, name='cadastro_curso'),
]
