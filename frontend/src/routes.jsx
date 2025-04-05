import { createBrowserRouter } from 'react-router-dom'
// Tela de Login
import LoginPage from './pages/login/LoginPage'

// import das telas base de cada perfil
import BaseGestao from './pages/base/Gestao/BaseGestao'
import BaseRegistro from './pages/base/Registro/BaseRegistro'
import BaseCoordenador from './pages/base/Coordenador/BaseCoordenador'
import BaseProfessor from './pages/base/Professor/BaseProfessor'
import BaseAluno from './pages/base/Aluno/BaseAluno'

// Filhos de Gestao
import HomeGestao from './pages/base/Gestao/home/HomeGestao'
// Servidor
import CadastroServidor from './pages/base/Gestao/cadastroServidor/CadastroServidor'
import ListarServidor from './pages/base/Gestao/listarServidor/ListarServidor'
// Aluno
import CadastroAluno from './pages/base/Gestao/cadastroAluno/CadastroAluno'
import ListarAluno from './pages/base/Gestao/listarAluno/ListarAluno'
import EditarAluno from './pages/base/Gestao/editarAluno/EditarAluno'
// Curso
import CadastroCurso from './pages/base/Gestao/cadastroCurso/CadastroCurso'
import ListarCurso from './pages/base/Gestao/listarCurso/ListarCurso'
import DetalhesCurso from './pages/base/Gestao/detalhesCurso/DetalhesCurso'
// Disciplina
import CadastroDisciplina from "./pages/base/Gestao/cadastroDisciplina/CadastroDisciplina"
import ListarDisciplina from './pages/base/Gestao/listarDisciplina/ListarDisciplina'
import EditarDisciplina from './pages/base/Gestao/editarDisciplina/EditarDisciplina'
// Calendario
import CalendarioPage from "./pages/base/Gestao/calendario/calendario"
import EventoCalendarioPage from "./pages/base/Gestao/calendario/eventoCalendario/eventoCalendario"
import CadastroCalendarioAcademicoPage from './pages/base/Gestao/calendario/calendarioAcademico/cadastroCalendarioAcademico'
import ListarCalendariosAcademicosPage from './pages/base/Gestao/calendario/calendarioAcademico/listaCalendariosAcademicos'
// PED
import CadastroPED from './pages/base/Gestao/cadastroPED/cadastroPED'
import DetalhesPEDGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPEDGestao'
import ListarPEDGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPEDGestao'
// PPT
import CadastroPPT from './pages/base/Gestao/cadastroPPT/cadastroPPT'
import ListarPPTGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPPTGestao'
import DetalhesPPTGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPPTGestao'
// Plano Estudos
import DetalhesPlanoEstudos from './pages/base/Gestao/detalhesPlanoEstudos/DetalhesPlanoEstudos'
// Atividades
import AtividadesDesenvolvidasGestao from './pages/base/Gestao/atividadesDesenvolvidasGestao/atividadesDesenvolvidas'
import DetalhesAtividadeGestao from './pages/base/Gestao/atividadesDesenvolvidasGestao/detalhesAtividade/detalhesAtividade'

// Filhos de Registro
import HomeRegistro from './pages/base/Registro/home/homeRegistro'

// Filhos de Coordenador
import HomeCoordenador from './pages/base/Coordenador/home/HomeCoordenador'
import ListarPEDEMICoordenador from './pages/base/Coordenador/listarPED_EMI/ListarPED_EMICoordenador'
import ListarPEDProEJACoordenador from './pages/base/Coordenador/listarPED_ProEJACoordenador/ListarPED_ProEJACoordenador'
import DetalhesPEDCoordenador from './pages/base/Coordenador/detalhesPED/DetalhesPEDCoordenador'

// Filhos de Professor
import HomeProfessor from './pages/base/Professor/home/HomeProfessor'
import PerfilProfessor from './pages/base/Professor/perfilProfessor/PerfilProfessor'
import ListarPEDProfessor from './pages/base/Professor/listarDependenciasProfessor/ListarPEDProfessor'
import DetalhesPEDProfessor from './pages/base/Professor/detalhesDependenciaProfessor/DetalhesPEDProfessor'
import CadastroPlanoEstudos from './pages/base/Professor/cadastroPlanoEstudos/CadastroPlanoEstudos'
import AtividadesPEDProfessor from './pages/base/Professor/atividadesDesenvolvidas/AtividadesPEDProfessor'
import AdicionarAtividade from './pages/base/Professor/atividadesDesenvolvidas/adicionarAtividade/adicionarAtividade'
import DetalhesAtividade from './pages/base/Professor/atividadesDesenvolvidas/detalhesAtividade/detalhesAtividade'
import AdicionarObservacao from './pages/base/Professor/observacoes/adicionarObservacao'
import ListarObservacoes from './pages/base/Professor/listarObservacoes/ListarObservacoes'
import DetalhesObservacoes from './pages/base/Professor/detalhesObservacoes/DetalhesObservacoes'

// Filhos de Aluno
import PerfilAluno from './pages/base/Aluno/perfilAluno/PerfilAluno'
import HomeAluno from './pages/base/Aluno/home/HomeAluno'
import CadastroAtividade from './pages/base/Professor/cadastroAtividade/CadastroAtividade'
import ListarAtividadesProfessor from './pages/base/Professor/listarAtividades/ListarAtividadesProfessor'
import DetalhesDependenciaAluno from './pages/base/Aluno/detalhesDependencia/DetalhesDependenciaAluno'
import ListarAtividadesAluno from './pages/base/Aluno/listarAtividades/ListarAtividadesAluno'
import DetalhesAtividadeAluno from './pages/base/Aluno/detalhesAtividade/DetalhesAtividadeAluno'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    // Rotas do perfil de Gestao Escolar
    {
        path: '/Gestão Escolar',
        element: <BaseGestao />,
        children: [
            {
                path: '/Gestão Escolar',
                element: <HomeGestao />
            },
            // Rotas de Servidores
            {
                path: '/Gestão Escolar/cadastroServidor',
                element: <CadastroServidor />
            },
            {
                path: '/Gestão Escolar/servidores',
                element: <ListarServidor />
            },
            {
                path: '/Gestão Escolar/servidores/:idServidor/editar',
                element: <CadastroServidor />
            },
            {
                path: '/Gestão Escolar/cadastroAluno',
                element: <CadastroAluno />
            },
            {
                path: '/Gestão Escolar/alunos',
                element: <ListarAluno />
            },
            {
                path: '/Gestão Escolar/alunos/:idAluno/editar',
                element: <EditarAluno />
            },
            {
                path: '/Gestão Escolar/cadastroCurso',
                element: <CadastroCurso />
            },
            {
                path: '/Gestão Escolar/cursos',
                element: <ListarCurso />
            },
            {
                path: '/Gestão Escolar/cursos/:idCurso',
                element: <DetalhesCurso />
            },
            {
                path: '/Gestão Escolar/cursos/:idCurso/editar',
                element: <CadastroCurso />
            },
            {
                path: '/Gestão Escolar/cadastroDisciplina',
                element: <CadastroDisciplina />
            },
            {
                path: '/Gestão Escolar/disciplinas',
                element: <ListarDisciplina />
            },
            {
                path: '/Gestão Escolar/disciplinas/:idDisciplina/editar',
                element: <EditarDisciplina />
            },
            {
                path: '/Gestão Escolar/calendario',
                element: <CalendarioPage />
            },
            {
                path: '/Gestão Escolar/cadastroCalendarioAcademico',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: '/Gestão Escolar/calendario/:idCalendario/editar',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: '/Gestão Escolar/CalendariosAcademicos',
                element: <ListarCalendariosAcademicosPage />
            },
            {
                path: '/Gestão Escolar/eventoCalendario',
                element: <EventoCalendarioPage />
            },
            {
                path: '/Gestão Escolar/calendario/evento/:idEvento',
                element: <EventoCalendarioPage />
            },
            {
                path: '/Gestão Escolar/cadastroPED',
                element: <CadastroPED />
            },
            {
                path: '/Gestão Escolar/peds/Integrado',
                element: <ListarPEDGestao />
            },
            {
                path: '/Gestão Escolar/peds/ProEJA',
                element: <ListarPEDGestao />
            },
            {
                path: '/Gestão Escolar/peds/Integrado/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: '/Gestão Escolar/peds/ProEJA/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: '/Gestão Escolar/peds/Integrado/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: '/Gestão Escolar/peds/ProEJA/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: '/Gestão Escolar/cadastroPPT',
                element: <CadastroPPT />
            },
            {
                path: '/Gestão Escolar/ppts',
                element: <ListarPPTGestao />
            },
            {
                path: '/Gestão Escolar/ppts/:idPpt',
                element: <DetalhesPPTGestao />
            },
            {
                path: '/Gestão Escolar/ppts/:idPpt/editar',
                element: <CadastroPPT />
            },
            {
                path: '/Gestão Escolar/peds/:modalidade/:idPed/planoEstudos/:planoId/',
                element: <DetalhesPlanoEstudos />
            },
            {
                path: '/Gestão Escolar/atividades/:pedTipo/:idPed',
                element: <AtividadesDesenvolvidasGestao />
            },
            {
                path: '/Gestão Escolar/atividades/:pedTipo/:idPed/detalhes/:atividadeId',
                element: <DetalhesAtividadeGestao />
            },


        ]
    },
    // Rotas de Registro Escolar
    {
        path: '/sessao/Registro Escolar/',
        element: <BaseRegistro />,
        children: [
            {
                path: ':idUsuario/',
                element: <HomeRegistro />
            },
            //     {
            //         path: ':idUsuario/listarPPTregistro',
            //         element: <ListarPPT />
            //     }
        ]
    },
    // Rotas de Coordenador
    {
        path: '/sessao/Coordenador/',
        element: <BaseCoordenador />,
        // adicionar abaixo, as children de coordenador
        children: [
            {
                path: ':idUsuario/',
                element: <HomeCoordenador />
            },
            {
                path: ':idUsuario/peds/Integrado',
                element: <ListarPEDEMICoordenador />
            },
            {
                path: ':idUsuario/peds/ProEJA/',
                element: <ListarPEDProEJACoordenador />
            },
            {
                path: ':idUsuario/peds/Integrado/:idPed',
                element: <DetalhesPEDCoordenador />
            },
            {
                path: ':idUsuario/peds/ProEJA/:pedId',
                element: <DetalhesPEDCoordenador />
            },

        ]
    },
    // Rotas de Professor
    {
        path: '/sessao/Professor/',
        element: <BaseProfessor />,
        //   adicionar abaixo, as children de professor
        children: [
            {
                path: ':idUsuario/',
                element: <HomeProfessor />

            },
            {
                path: ':idUsuario/perfil/',
                element: <PerfilProfessor />
            },
            {
                path: ':idUsuario/atividades/',
                element: <ListarAtividadesProfessor />
            },
            {
                path: ':idUsuario/atividades/:atividadeId/editar',
                element: <CadastroAtividade />
            },
            {
                path: ':idUsuario/peds/:modalidade/',
                element: <ListarPEDProfessor />
            },
            {
                path: ':idUsuario/peds/:modalidade/:pedId',
                element: <DetalhesPEDProfessor />
            },
            {
                path: ':idUsuario/peds/:modalidade/:pedId/planoEstudos',
                element: <CadastroPlanoEstudos />
            },
            {
                path: ':idUsuario/peds/:modalidade/:pedId/planoEstudos/:planoId/',
                element: <CadastroPlanoEstudos />
            },
            {
                path: ':idUsuario/cadastroAtividade/',
                element: <CadastroAtividade />
            },
            {
                path: ':idUsuario/peds/:modalidade/:pedId/atividades',
                element: <AtividadesPEDProfessor />
            },
            {
                path: ':idUsuario/adicionarObservacao',
                element: <AdicionarObservacao />
            },
            {
                path: ':idUsuario/observacoes/:pedTipo/:pedId/:idObservacao',
                element: <DetalhesObservacoes />
            },
            {
                path: ':idUsuario/observacoes/:pedTipo/:pedId',
                element: <ListarObservacoes />
            },
            {
                path: ':idUsuario/editarObservacao/:idObservacao',
                element: <AdicionarObservacao />,
            },


        ]
    },
    //   Rotas de Aluno
    {
        path: '/sessao/Aluno/',
        element: <BaseAluno />,
        //   adicionar abaixo, as children de aluno
        children: [
            {
                path: ':idUsuario/',
                element: <HomeAluno />
            },
            {
                path: ':idUsuario/perfil',
                element: <PerfilAluno />
            },
            {
                path: ':idUsuario/:modalidade/:pedId/detalhes',
                element: <DetalhesDependenciaAluno />
            },
            {
                path: ':idUsuario/:modalidade/:pedId/detalhes/atividades',
                element: <ListarAtividadesAluno />
            },
            {
                path: ':idUsuario/:modalidade/:pedId/detalhes/atividades/:atividadeId',
                element: <DetalhesAtividadeAluno />
            }
        ]
    },
])

export default router