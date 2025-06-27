from django.urls import path
from dependencias_app.views.observacao_views import *
from dependencias_app.views.aluno_views import *
from dependencias_app.views.calendario_views import *
from dependencias_app.views.ppt_views import *
from dependencias_app.views.ped_views import *
from dependencias_app.views.atividade_views import *
from dependencias_app.views.plano_estudos_views import *
from dependencias_app.views.notificacao_views import *


urlpatterns = [
    path('tokens/', ),
    # views de grupos
    path('grupos/cadastrar/', ),

    # views de calendarios
    path('calendario/listar/', listar_calendarios),
    path('calendario/buscar/<str:modalidade>/<str:titulo>/', buscar_por_titulo),
    path('calendario/<str:calendarioId>/', obter_calendario),

    # views de eventos
    path('evento/cadastrar/', cadastrar_evento),
    path('calendario/<str:calendarioId>/eventos/', listar_eventos_calendario),
    path('evento/<str:eventoId>/', obter_evento),
    path('evento/<str:eventoId>/editar/', editar_evento),

    # view de PPT
    path('ppt/cadastrar/', cadastrar_PPT),
    path('ppt/listar/', listar_PPT),
    path('ppt/detalhes/<str:pptId>/', detalhes_PPT),
    path('ppt/editar/<str:pptId>/', editar_ppt),
    path('ppt/status/<str:pptId>/', trocar_status),
    
    # views de PED
    path('ped/<str:modalidade>/cadastrar/', cadastrar_PED),
    path('ped/<str:modalidade>/listar/', listar_PED),
    path('ped/<str:modalidade>/listar/<str:professorId>/', listar_PED),
    path('ped/<str:modalidade>/detalhes/<str:pedId>/', detalhes_PED),
    path('ped/<str:modalidade>/editar/<str:pedId>/', editar_PED),
    path('ped/<str:modalidade>/desativar/<str:pedId>/', desativar_PED),
    path('aluno/dependencias/', listar_dependencias_aluno),

    #views para atividades/avaliações
    path('atividade/cadastro/<str:modalidade>/', cadastrar_atividade),
    path('plano-atividades/vincular/<int:pedId>/<str:modalidade>/', vincular_atividades),
    path('plano-atividades/professor/listar/', listar_atividades_professor),
    path('plano-atividades/professor/listar/<str:modalidade>/', listar_atividades_professor),
    path('plano-atividades/<int:pedId>/<str:modalidade>/', listar_atividades),
    path('plano-atividades/detalhes/<str:modalidade>/<int:atividadeId>/', buscar_atividade),
    path('plano-atividades/avaliacao/<str:modalidade>/<int:avaliacaoId>/', buscar_por_avaliacao),
    path('plano-atividades/editar/<str:modalidade>/<int:atividadeId>/', editar_atividade),

    # views de plano de estudos
    path('plano-estudos/cadastrar/<str:modalidade>/', cadastrar_plano_estudos),
    path('plano-estudos/detalhes/<int:planoId>/<str:modalidade>/', detalhes_plano_estudos),
    path('plano-estudos/editar/<int:planoId>/<str:modalidade>/', editar_plano_estudos,),
    
    #views para tela de observaçoes
    path('visualizar-observacao/<int:id>/', visualizar_observacao, name='visualizar_observacao'),


    #views para observações
    path('adicionar-observacao/', adicionar_observacao, name='adicionar_observacao'),
    #path('visualizar-observacao/', visualizar_observacao, name='visualizar_observacao'),
    path('listar-observacoes/', listar_observacoes, name='listar_observacoes'),
    path('editar-observacao/<int:id>/', editar_observacao, name='editar_observacao<id>'),
    
    # Views de notificacao
    path('notificacoes/<int:idUsuario>/', buscar_notificacoes),
    path('notificacoes/troca-status/<int:idNotificacao>/', trocar_status),
]