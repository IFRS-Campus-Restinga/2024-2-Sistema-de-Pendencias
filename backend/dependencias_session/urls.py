from django.urls import path
from dependencias_session.views.grupo_views import *
from dependencias_session.views.permissao_views import *
from dependencias_session.views.token_views import *


urlpatterns = [
    # views de autenticação
    path('tokens/', obter_tokens),
    path('tokens/refresh/', renovar_token),

    # views de grupos
    path('grupo/cadastrar/', cadastrar_grupo),
    path('grupo/listar/', listar_grupos),
    path('grupo/<str:grupo_id>/detalhes/', detalhes_grupo),
    path('grupo/<str:grupo_id>/editar/', editar_grupo),

    path('permissoes/listar/', listar_permissoes),
    path('permissoes/listar/<str:grupo_id>/', listar_por_grupo),
    path('permissoes/listar/<str:grupo_id>/nao_vinculadas/', listar_nao_vinculadas),
]