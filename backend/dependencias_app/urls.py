from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from dependencias_app.views.observacao_views import *
from dependencias_app.views.usuario_views import *
from dependencias_app.views.professor_views import *
from dependencias_app.views.aluno_views import *
from dependencias_app.views.disciplina_views import *
from dependencias_app.views.curso_views import *
from dependencias_app.views.calendario_views import *
from dependencias_app.views.ppt_views import *
from dependencias_app.views.ped_views import *
from dependencias_app.views.atividade_views import *
from dependencias_app.views.plano_estudos_views import *
from dependencias_app.views.notificacao_views import *


urlpatterns = [
    # views de usuários
    path('usuario/cadastrar/', cadastrar_usuario),
    path('usuario/listar/<str:perfil>/', listar_usuarios_por_perfil),
    path('usuario/<str:idUsuario>/', get_infos_usuario),
    path('usuario/<str:idUsuario>/editar/', editar_usuario),
    path('listar-grupos/', listar_grupos),

    # cadastra informações adicionais dos alunos e professores
    path('dados-adicionais-aluno/', infos_adicionais_aluno),
    path('dados-adicionais-professor/', infos_adicionais_professor),
    path('usuario/<str:param>/<str:grupo>', listar_por_parametro),

    # views de curso
    path('curso/cadastrar/', cadastrar_curso),
    path('curso/listar/', listar_cursos),
    path('curso/listar/<str:modalidade>/', listar_por_modalidade),
    path('curso/<str:cursoId>/', obter_curso),
    path('curso/<str:cursoId>/editar/', editar_curso),

    # views de disciplinas
    path('disciplina/cadastrar/', cadastrar_disciplina),
    path('disciplina/listar/', listar_disciplinas),
    path('disciplina/<str:disciplinaId>/', buscar_disciplina),
    path('disciplina/editar/<str:disciplinaId>/', editar_disciplina),

    # views de calendarios
    path('calendario/cadastrar/', cadastrar_calendario),
    path('calendario/listar/', listar_calendarios),

    # views de eventos
    path('eventos/cadastrar/', cadastrar_evento),
    path('calendario/<str:calendarioId>/eventos/', listar_eventos_calendario),

    # view de PPT
    path('ppt/cadastrar/', cadastrar_PPT),
    path('ppt/listar/', listar_PPT),
    path('ppt/detalhes/<int:pptId>/', detalhes_PPT),
    path('ppt/editar/<int:pptId>/', editar_ppt),
    path('ppt/status/<int:pptId>/', trocar_status),
    
    # views de PED
    path('ped/<str:modalidade>/cadastrar/', cadastrar_PED),
    path('ped/<str:modalidade>/listar/', listar_PED),
    path('ped/<str:modalidade>/listar/<int:professorId>/', listar_PED),
    path('ped/<str:modalidade>/detalhes/<int:pedId>/', detalhes_PED),
    path('ped/<str:modalidade>/editar/<int:pedId>/', editar_PED),
    path('ped/<str:modalidade>/desativar/<int:pedId>/', desativar_PED),
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
    # No arquivo urls.py
    #path('visualizar-observacao/<int:id>/', visualizar_observacao, name='visualizar_observacao'),
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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)