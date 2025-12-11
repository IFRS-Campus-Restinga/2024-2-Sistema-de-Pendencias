from django.urls import path
from dependencias_app.views.usuario_views import *
from dependencias_app.views.grupo_views import *
from dependencias_app.views.permissao_views import *
from dependencias_app.views.ppt_views import *
from dependencias_app.views.ped_views import *
from dependencias_app.views.atividade_views import *
from dependencias_app.views.avaliacao_views import *
from dependencias_app.views.plano_estudos_views import *
from dependencias_app.views.acompanhamento_views import *
from dependencias_app.views.form_encerramento_views import *


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
    path('ppts/listar/coordenador', listar_PPT_coordenador),
    path('ppts/listar/aluno/', listar_PPT_aluno),
    path('ppts/<str:ppt_id>/', detalhes_PPT),
    path('ppts/<str:ppt_id>/editar/status/', trocar_status_PPT),
    
    # views de PED
    path('peds/<str:modalidade>/cadastrar/', cadastrar_PED),
    path('peds/<str:modalidade>/listar/', listar_PED_por_modalidade),
    path('peds/<str:modalidade>/listar/professor/', listar_PED_por_professor),
    path('peds/<str:modalidade>/listar/coordenador/', listar_PED_por_coordenador),
    path('peds/listar/aluno/', listar_PED_por_aluno), 
    path('peds/<str:modalidade>/<str:ped_id>/', detalhes_PED),
    path('peds/<str:modalidade>/<str:ped_id>/editar/', editar_PED),
    path('peds/<str:modalidade>/<str:ped_id>/editar/status/', trocar_status_PED),

    # views para plano de estudos
    path('plano-estudos/<str:modalidade>/cadastrar/', cadastrar_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/', detalhes_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/editar/', editar_plano_estudos),

    # views para atividades
    path('atividades/<str:modalidade>/cadastrar/', cadastrar_atividade),
    path('atividades/<str:modalidade>/', listar_atividades),
    path('atividades/<str:modalidade>/<str:atividade_id>/', detalhes_atividade),
    path('atividades/<str:modalidade>/<str:atividade_id>/editar/', editar_atividade),

    # views para plano de atividades
    path('plano-atividades/<str:modalidade>/salvar/<str:ped_id>/', salvar_plano_atividades),
    path('plano-atividades/<str:modalidade>/<str:ped_id>/', listar_avaliacoes_por_PED),
    
    #views para observações
    path('acompanhamentos/<str:modalidade>/cadastrar/', cadastrar_acompanhamento),
    path('acompanhamentos/<str:modalidade>/<str:ped_id>/listar/', listar_acompanhamentos),
    path('acompanhamentos/<str:modalidade>/<str:acompanhamento_id>/editar/', editar_acompanhamento),

    # views para form encerramento
    path('form-encerramento/<str:modalidade>/cadastrar/<str:ped_id>/', cadastrar_form_encerramento),
    path('form-encerramento/<str:modalidade>/<str:form_encerramento_id>/', detalhes_form_encerramento),
    path('form-encerramento/<str:modalidade>/<str:form_encerramento_id>/editar/', editar_form_encerramento),
]