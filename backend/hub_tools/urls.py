from django.urls import path
from .views.calendario_views import *
from .views.curso_views import *
from .views.disciplina_views import *
from .views.usuario_views import *


urlpatterns = [
    # views de usuário
    path('usuarios/get/perfil/<str:perfil>/', buscar_usuario),

    # views de curso
    path('cursos/get/', listar_cursos),

    #views de disciplina
    path('cursos/get/<str:curso_id>/curriculo/', listar_disciplinas_por_curso),

    # views de calendario
    path('calendarios/get/', listar_calendarios),

]