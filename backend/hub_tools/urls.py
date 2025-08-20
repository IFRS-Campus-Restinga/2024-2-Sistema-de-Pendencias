from django.urls import path
from .views.calendario_views import *
from .views.curso_views import *
from .views.disciplina_views import *
from .views.usuario_views import *


urlpatterns = [
    # views de usuário
    path('usuarios/get/grupo/<str:grupo>/', buscar_usuario),

]