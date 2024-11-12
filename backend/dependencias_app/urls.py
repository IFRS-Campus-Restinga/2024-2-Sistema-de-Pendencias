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



urlpatterns = [
    # views cadastro de usuários
    path('cadastrar-gestao-escolar/', cadastrar_gestao_escolar),
    path('cadastrar-registro-escolar/', cadastrar_registro_escolar),
    path('cadastrar-coordenador/', cadastrarCoordenador),
    path('cadastrar-professor/', cadastrar_professor),
    path('cadastrar-aluno/', cadastrar_aluno),
    path('dados-adicionais-aluno/', infos_adicionais_aluno),
    path('dados-adicionais-professor/', infos_adicionais_professor),

    # views de curso/disciplinas
    # curso já manipula turmas por vínculo, por isso turmas não necessitam de uma view própria
    path('cadastrar-curso/', cadastrar_curso),
    path('cadastrar-disciplina/', cadastrar_disciplina),
    path('listar-cursos/', listar_cursos),
    path('listar-cursos/<str:modalidade>/', listar_por_modalidade),
    path('listar-disciplinas/', listar_disciplinas, name='listar_disciplinas'),
    path('listar-turmas/<int:curso>/', listar_turmas_por_curso),

    # views de evento/calendario
    path('cadastrar-evento/', cadastrar_evento, name='cadastrar_evento'),
    path('listar-eventos/', listar_eventos, name='listar_eventos'),
    path('editar-evento/<int:evento_id>/', atualizar_evento, name='atualizar_evento'),
    path('deletar-evento/<int:evento_id>/', deletar_evento, name='deletar_evento'),
    path('eventos/<int:evento_id>/', obter_evento, name='obter_evento'),
    

    # views de lista de usuários
    path('usuario/<int:idUsuario>/', get_infos_usuario),
    path('dados-aluno/<int:idAluno>/', get_aluno_infos),
    path('listar-servidores/', listar_servidores, name='listar_servidores'),
    path('usuarios/<str:param>/<str:grupo>', listar_por_parametro),

    # views de exclusão de usuários
    path('deletar-servidor/<int:idusuario>/', deletar_servidor, name='deletar_servidor'),

    #views de visualizar cadastro
    path('visualizar-servidor/', visualizar_servidor, name='visualizar_servidor'),

    # view de PPT
    path('cadastrar-ppt/', cadastrar_ppt),
    path('listar-ppt/', listar_ppt),
    path('listar-ppt/<int:idPpt>/', listar_ppt_id),
    #path('editar-ppt/<int:idPpt>/', editar_ppt),
    
    # views de PED
    path('cadastrarPED/EMI/', cadastrar_PED_EMI),
    path('cadastrarPED/ProEJA/', cadastrar_PED_ProEJA)

    ]


