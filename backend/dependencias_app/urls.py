from django.urls import path
<<<<<<< HEAD
from dependencias_app import views
=======
from dependencias_app.views import teste
from dependencias_app.views import servidorViews
from dependencias_app.views import alunoViews
from dependencias_app.views import cursoViews
>>>>>>> 66bf1417164ddf7298b8883126ad2d50c9f7a071

urlpatterns = [
    path('teste', teste.view_teste),
    path('cadastrar-servidor', servidorViews.cadastrar_servidor),
    path('cadastrar-aluno/', alunoViews.cadastrar_aluno),
    path('cadastrar-curso/', cursoViews.cadastrar_curso),
    path('teste', teste.view_teste),
]
