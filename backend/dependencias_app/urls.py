from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from dependencias_app.views.usuarioBaseViews import *
from dependencias_app.views.gestaoEscolarViews import *
from dependencias_app.views.registroEscolarViews import *
from dependencias_app.views.coordenadorViews import *
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


urlpatterns = [
    # views cadastro de usuários
    path('cadastrar-gestao-escolar/', cadastrar_gestao_escolar),
    path('cadastrar-registro-escolar/', cadastrar_registro_escolar),
    path('cadastrar-coordenador/', cadastrarCoordenador),
    path('cadastrar-professor/', cadastrar_professor),
    path('cadastrar-aluno/', cadastrar_aluno),
    path('dados-adicionais-aluno/', infos_adicionais_aluno),
    path('dados-adicionais-professor/', infos_adicionais_professor),
    path('listar-grupos/', listar_grupos),

    # views de curso
    # curso já manipula turmas por vínculo, por isso turmas não necessitam de uma view própria
    path('cadastrar-curso/', cadastrar_curso),
    path('listar-cursos/', listar_cursos),
    path('listar-cursos/<str:modalidade>/', listar_por_modalidade),
    path('cursos/<int:curso_id>/', obter_curso, name='obter_curso'),
    path('editar-curso/<int:curso_id>/', atualizar_curso, name='atualizar_curso'),
    path('cursos/<int:curso_id>/atualizar/', atualizar_curso, name='atualizar_curso'),

    # views de disciplinas
    path('cadastrar-disciplina/', cadastrar_disciplina),
    path('listar-disciplinas/', listar_disciplinas, name='listar_disciplinas'),

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


    # views de lista de usuários
    path('usuario/<int:idUsuario>/', get_infos_usuario),
    path('dados-aluno/<int:idAluno>/', get_aluno_infos),
    path('listar-servidores/', listar_servidores, name='listar_servidores'),
    path('usuarios/<str:param>/<str:grupo>', listar_por_parametro),
    path('listar-alunos/', listar_alunos),

    # views de exclusão de usuários
    path('deletar-servidor/<int:idusuario>/', deletar_servidor, name='deletar_servidor'),

    #views de visualizar cadastro
    path('visualizar-servidor/', visualizar_servidor, name='visualizar_servidor'),

    # view de PPT
    path('cadastrar-ppt/', cadastrar_ppt),
    path('listar-ppt/', listar_ppt),
    path('listar-ppt/<int:idPpt>/', listar_ppt_id),
    path('editar-ppt/<int:idPpt>/', editar_ppt),
    path('desativar-ppt/<int:idPpt>/', desativar_ppt),
    
    # views de PED
    path('cadastrarPED-EMI/', cadastrar_PED_EMI),
    path('cadastrarPED-ProEJA/', cadastrar_PED_ProEJA),
    path('ped-emi/', listar_PED_EMI),
    path('ped-proeja/', listar_PED_ProEJA),
    path('atualizar-emi/<int:pedId>/', atualizar_EMI),
    path('atualizar-proeja/<int:pedId>/', atualizar_ProEJA),
    path('ped-emi/<int:professorId>/', listar_PED_EMI),
    path('ped-proeja/<int:professorId>/', listar_PED_ProEJA),
    path('ped/<int:pedId>/<str:modalidade>/', por_id),
    #path('cadastrar-plano-estudos/', cadastrar_plano_estudos),
    path('cadastrar-plano-estudos/<int:pedId>/', cadastrar_plano_estudos),
    path('desativar-ped/<int:pedId>/<str:modalidade>/', desativar_PED),
    path('visualizar-servidor/', visualizar_servidor, name='visualizar_servidor'),

    #path('detalhes-planoEstudos/<str:ped_tipo>/<int:ped_id>/<int:ped_id>/', detalhes_planoEstudos, name='detalhes_planoEstudos'),
    # urls.py
    path('detalhes-planoEstudos/<int:ped_id>/', detalhes_planoEstudos, name='detalhes_planoEstudos'),

    #views para atividades da ped
    path('listar-atividades/<str:ped_tipo>/<int:ped_id>/', listar_atividades, name='listar_atividades'),
    path('atualizar-nota-final/<str:ped_tipo>/<int:ped_id>/', atualizar_nota_final, name='atualizar_nota_final'),
    path('adicionar-atividades/<str:ped_tipo>/<int:ped_id>/', adicionar_atividade, name='adicionar_atividades'),
    path('detalhes-atividade/<str:ped_tipo>/<int:ped_id>/<int:atividade_id>/', detalhes_atividade, name='detalhes_atividade'),
    path('editar-atividade/<str:ped_tipo>/<int:ped_id>/<int:atividade_id>/', editar_atividade, name='editar_atividade'),
    path('adicionar-plano-atividades/<str:ped_tipo>/<int:ped_id>/', adicionar_plano_atividades, name='adicionar_plano_atividades'),
    #path('ped/<str:ped_tipo>/<int:ped_id>/plano-atividades/', obter_plano_atividades, name='obter_plano_atividades'),

    #view editar servidor
    path('editar-servidor/<int:id>/', editar_servidor, name='editar_servidor'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)