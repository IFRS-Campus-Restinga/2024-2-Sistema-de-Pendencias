from django.urls import path
from dependencias_app.views.usuario_views import *
from dependencias_app.views.grupo_views import *
from dependencias_app.views.permissao_views import *
from dependencias_app.views.ppt_views import *
from dependencias_app.views.ped_views import *
from dependencias_app.views.atividade_views import *
from dependencias_app.views.avaliacao_views import *
from dependencias_app.views.plano_estudos_views import *
from dependencias_app.views.notificacao_views import *
from dependencias_app.views.acompanhamento_views import *


urlpatterns = [
    # views de usuário
    path('usuarios/cadastrar/', cadastrar_usuario),
    path('usuarios/listar/perfil/<str:perfil>/', listar_usuarios_perfil),
    path('usuarios/listar/grupo/<str:grupo>/', listar_usuarios_grupo),
    path('usuarios/<str:usuario_id>/', detalhes_usuario),
    path('usuarios/<str:usuario_id>/editar/', editar_usuario),

    # views de grupo
    path('grupos/cadastrar/', cadastrar_grupo),
    path('grupos/listar/', listar_grupos),
    path('grupos/<str:grupo_id>/', detalhes_grupo),
    path('grupos/<str:grupo_id>/editar/', editar_grupo),

    # views de permissão
    path('permissoes/listar/', listar_permissoes),
    path('permissoes/listar/<str:grupo_id>/', listar_por_grupo),
    path('permissoes/listar/<str:grupo_id>/nao_vinculadas/', listar_nao_vinculadas),

    # view de PPT
    path('ppts/cadastrar/', cadastrar_PPT),
    path('ppts/listar/', listar_PPT),
    path('ppts/<str:ppt_id>/', detalhes_PPT),
    path('ppts/<str:ppt_id>/desativar/', desativar_PPT),
    
    # views de PED
    path('peds/<str:modalidade>/cadastrar/', cadastrar_PED),
    path('peds/<str:modalidade>/listar/', listar_PED_por_modalidade),
    path('peds/<str:modalidade>/<str:ped_id>/', detalhes_PED),
    path('peds/<str:modalidade>/<str:ped_id>/editar/', editar_PED),
    path('peds/<str:modalidade>/<str:ped_id>/desativar/', desativar_PED),

    #views para atividades
    path('atividades/cadastrar/<str:modalidade>/', cadastrar_atividade),
    path('atividades/listar/', listar_atividades),
    path('atividades/<str:modalidade>/<str:atividade_id>/', buscar_atividade_por_id),
    path('atividades/<str:modalidade>/<str:atividade_id>/editar/', editar_atividade),

    # views para avaliações
    path('avaliacoes/<str:modalidade>/cadastrar/', cadastrar_avaliacoes),
    path('avaliacoes/<str:modalidade>/<str:ped_id>/listar/', listar_avaliacoes_por_PED),
    path('avaliacoes/<str:modalidade>/editar/', editar_avaliacoes),

    # views de plano de estudos
    path('plano-estudos/<str:modalidade>/cadastrar/', cadastrar_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/', detalhes_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/editar/', editar_plano_estudos,),
    
    #views para observações
    path('acompanhamentos/<str:modalidade>/<str:ped_id>/cadastrar/', cadastrar_acompanhamento),
    path('acompanhamentos/<str:modalidade>/<str:ped_id>/listar/', listar_acompanhamentos),
    path('acompanhamentos/<str:modalidade>/<str:ped_id>/<str:acompanhamento_id>/', visualizar_acompanhamento),
    path('acompanhamentos/<str:modalidade>/<str:ped_id>/<str:acompanhamento_id>/editar/', editar_acompanhamento),
    
    # Views de notificacao
    path('notificacoes/<str:usuario_id>/', buscar_notificacoes),
    path('notificacoes/<str:notificacao_id>/editar/', trocar_status),
]