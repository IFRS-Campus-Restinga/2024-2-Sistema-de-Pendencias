from django.urls import path
from dependencias_app.views.ppt_views import *
from dependencias_app.views.ped_views import *
from dependencias_app.views.atividade_views import *
from dependencias_app.views.avaliacao_views import *
from dependencias_app.views.plano_estudos_views import *
from dependencias_app.views.notificacao_views import *
from dependencias_app.views.observacao_views import *


urlpatterns = [
    # view de PPT
    path('ppt/cadastrar/', cadastrar_PPT),
    path('ppt/listar/', listar_PPT),
    path('ppt/<str:ppt_id>/detalhes/', detalhes_PPT),
    path('ppt/<str:ppt_id>/editar/', editar_ppt),
    
    # views de PED
    path('ped/<str:modalidade>/cadastrar/', cadastrar_PED),
    path('ped/<str:modalidade>/listar/', listar_PED_por_modalidade),
    path('ped/<str:modalidade>/<str:ped_id>/detalhes/', detalhes_PED),
    path('ped/<str:modalidade>/<str:ped_id>/editar/', editar_PED),

    #views para atividades
    path('atividade/cadastrar/<str:modalidade>/', cadastrar_atividade),
    path('atividade/listar/', listar_atividades),
    path('atividade/<str:modalidade>/<str:atividade_id>/detalhes/', buscar_atividade_por_id),
    path('atividade/<str:modalidade>/<str:atividade_id>/editar/', editar_atividade),

    # views para avaliações
    path('avaliacao/<str:modalidade>/cadastrar/', cadastrar_avaliacoes),
    path('avaliacao/<str:modalidade>/<str:ped_id>/listar/', listar_avaliacoes_por_PED),
    path('avaliacao/<str:modalidade>/editar/', editar_avaliacoes),

    # views de plano de estudos
    path('plano-estudos/<str:modalidade>/cadastrar/', cadastrar_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/detalhes/', detalhes_plano_estudos),
    path('plano-estudos/<str:modalidade>/<str:plano_estudos_id>/editar/', editar_plano_estudos,),
    
    #views para observações
    path('observacao/<str:modalidade>/<str:ped_id>/cadastrar/', cadastrar_observacao),
    path('observacoes/<str:modalidade>/<str:ped_id>/listar/', listar_observacoes),
    path('observacao/<str:modalidade>/<str:ped_id>/<str:observacao_id>/detalhes/', visualizar_observacao),
    path('observacao/<str:modalidade>/<str:ped_id>/<str:observacao_id>/editar/', editar_observacao),
    
    # Views de notificacao
    path('notificacoes/<str:usuario_id>/', buscar_notificacoes),
    path('notificacoes/<str:notificacao_id>/editar/', trocar_status),
]