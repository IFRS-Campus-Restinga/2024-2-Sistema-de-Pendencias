from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from dependencias_app.views.observacaoViews import *
from dependencias_app.views.usuarioBaseViews import *
from dependencias_app.views.professorViews import *
from dependencias_app.views.servidorViews import *
from dependencias_app.views.alunoViews import *
from dependencias_app.views.disciplinaViews import *
from dependencias_app.views.cursoViews import *
from dependencias_app.views.eventoViews import *
from dependencias_app.views.pptViews import *
from dependencias_app.views.pedViews import *
from dependencias_app.views.atividadeViews import *
from dependencias_app.views.planoEstudosViews import *
from dependencias_app.views.notificacaoViews import *


urlpatterns = [
    # views de usuários
    path('cadastrar-usuario/', cadastrar_usuario),
    path('usuario/<int:idUsuario>/', get_infos_usuario),
    path('listar-servidores/', listar_servidores),
    path('listar-alunos/', listar_alunos),
    path('usuario/<int:idUsuario>/editar/', editar_usuario),
    path('visualizar-servidor/', visualizar_servidor, name='visualizar_servidor'),
    path('listar-grupos/', listar_grupos),

    # cadastra informações adicionais dos alunos e professores
    path('dados-adicionais-aluno/', infos_adicionais_aluno),
    path('dados-adicionais-professor/', infos_adicionais_professor),
    path('usuarios/<str:param>/<str:grupo>', listar_por_parametro),


    # views de curso
    path('cadastrar-curso/', cadastrar_curso),
    path('listar-cursos/', listar_cursos),
    path('listar-cursos/<str:modalidade>/', listar_por_modalidade),
    path('cursos/<int:cursoId>/', obter_curso),
    path('curso/<int:cursoId>/editar', editar_curso),

    # views de disciplinas
    path('cadastrar-disciplina/', cadastrar_disciplina),
    path('listar-disciplinas/', listar_disciplinas, name='listar_disciplinas'),
    path('disciplina/<int:disciplinaId>/', buscar_disciplina),
    path('disciplina/editar/<int:disciplinaId>/', editar_disciplina),

    # views de evento/calendario
    path('cadastrar-evento/', cadastrar_evento, name='cadastrar_evento'),
    path('listar-eventos/', listar_eventos, name='listar_eventos'),
    path('editar-evento/<int:evento_id>/', atualizar_evento, name='atualizar_evento'),
    path('deletar-evento/<int:evento_id>/', deletar_evento, name='deletar_evento'),
    path('eventos/<int:evento_id>/', obter_evento, name='obter_evento'),
    path('cadastrar-calendario-academico/', cadastrar_calendario_academico, name='cadastrar_calendario_academico'),
    path('listar-calendarios-academicos/', listar_calendarios_academicos, name='listar_calendarios_academicos'),
    path('calendario-academico/<int:id_pacote>/eventos/', listar_eventos_do_calendario_academico, name='listar_eventos_do_calendario_academico'),
    path('atualizar-calendario-academico/<int:id_calendario>/', atualizar_calendario_academico, name='atualizar_calendario_academico'),
    path('obter-calendario-academico/<int:id_calendario>/', obter_calendario_academico, name='obter_calendario_academico'),

    #views de visualizar cadastro
    path('visualizar-servidor/', visualizar_servidor, name='visualizar_servidor'),

    # view de PPT
    path('cadastrar-ppt/', cadastrar_ppt),
    path('listar-ppt/', listar_ppt),
    path('listar-ppt-registro/', listar_ppt_registro),
    path('listar-ppt/<int:idPpt>/', listar_ppt_id),
    path('editar-ppt/<int:idPpt>/', editar_ppt),
    path('desativar-ppt/<int:idPpt>/', desativar_ppt),
    path('ppt-em-andamento/<int:idPpt>/', ppt_em_andamento),
    path('ppt-lancado/<int:idPpt>/', ppt_lancado),
    
    # views de PED
    path('cadastrarPED-EMI/', cadastrar_PED_EMI),
    path('cadastrarPED-ProEJA/', cadastrar_PED_ProEJA),
    path('ped-emi/', listar_PED_EMI),
    path('ped-proeja/', listar_PED_ProEJA),
    path('ped-emi/<int:professorId>/', listar_PED_EMI),
    path('ped-proeja/<int:professorId>/', listar_PED_ProEJA),
    path('atualizar-emi/<int:pedId>/', atualizar_EMI),
    path('atualizar-proeja/<int:pedId>/', atualizar_ProEJA),
    path('ped/<int:pedId>/<str:modalidade>/', por_id),
    path('desativar-ped/<int:pedId>/<str:modalidade>/', desativar_PED),
    path('aluno/dependencias/', listar_dependencias_aluno),
    path('ped-emi/<int:coordenadorId>/', listar_PED_EMI),
    path('ped-proeja/<int:coordenadorId>/', listar_PED_ProEJA),

    #views para atividades da ped
    path('atividade/cadastro/<str:modalidade>/', cadastrar_atividade),
    path('plano-atividades/vincular/<int:pedId>/<str:modalidade>/', vincular_atividades),
    path('atividade/listar/', listar_atividades_professor),
    path('plano-atividades/<int:pedId>/<str:modalidade>/', listar_atividades),
    path('atualizar-nota-final/<str:ped_tipo>/<int:ped_id>/', atualizar_nota_final, name='atualizar_nota_final'),
    path('detalhes-atividade/<str:ped_tipo>/<int:ped_id>/<int:atividade_id>/', detalhes_atividade, name='detalhes_atividade'),
    path('editar-atividade/<str:ped_tipo>/<int:ped_id>/<int:atividade_id>/', editar_atividade, name='editar_atividade'),
    path('deletar-atividade/<str:ped_tipo>/<int:ped_id>/<int:atividade_id>/', delete_atividade, name='deletar_atividade'),
    path('adicionar-plano-atividades/<str:ped_tipo>/<int:ped_id>/', adicionar_plano_atividades, name='adicionar_plano_atividades'),
    path('exibir_nota_final/<str:ped_tipo>/<int:ped_id>/', exibir_nota_final, name='exibir_nota_final'),


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

    #view editar servidor
    path('editar-servidor/<int:id>/', editar_servidor, name='editar_servidor'),

    # Views de notificacao
    path('notificacoes/<int:idUsuario>/', buscar_notificacoes),
    path('notificacoes/troca-status/<int:idNotificacao>/', trocar_status),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)