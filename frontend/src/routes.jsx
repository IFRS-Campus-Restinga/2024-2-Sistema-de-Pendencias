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
import CadastroCurso from './pages/base/Gestao/cadastroCurso/CadastroCurso'
import CadastroServidor from './pages/base/Gestao/cadastroServidor/CadastroServidor'
import CadastroAluno from './pages/base/Gestao/cadastroAluno/CadastroAluno'
import CadastroDisciplina from "./pages/base/Gestao/cadastroDisciplina/CadastroDisciplina"
import CadastroPED from './pages/base/Gestao/cadastroPED/cadastroPED'
import ListarServidor from './pages/base/Gestao/listarServidor/ListarServidor'
import EventoCalendarioPage from "./pages/base/Gestao/calendario/eventoCalendario/eventoCalendario"
import CadastroCalendarioAcademicoPage from './pages/base/Gestao/calendario/calendarioAcademico/cadastroCalendarioAcademico'
import ListarCalendariosAcademicosPage from './pages/base/Gestao/calendario/calendarioAcademico/listaCalendariosAcademicos'
import ListarCurso from './pages/base/Gestao/listarCurso/ListarCurso'
import ListarDisciplina from './pages/base/Gestao/listarDisciplina/ListarDisciplina'
import CalendarioPage from "./pages/base/Gestao/calendario/calendario"
import DetalhesServidor from './pages/base/Gestao/detalhesServidor/DetalhesServidor'
import DetalhesPPT from './pages/base/Gestao/detalhesPPT/detalhesPPT'
import DetalhesPED from './pages/base/Gestao/detalhesPED/DetalhesPED'
import CadastroPPT from './pages/base/Gestao/cadastroPPT/cadastroPPT'
import ListarAluno from './pages/base/Gestao/listarAluno/ListarAluno'
import DetalhesAluno from './pages/base/Gestao/detalhesAluno/DetalhesAluno'

// Filhos de Registro
import HomeRegistro from './pages/base/Registro/home/homeRegistro'
import ListarPPTRegistro from './pages/base/Registro/listarPPT/listarPPT'
// Filhos de Coordenador

// Filhos de Professor
import HomeProfessor from './pages/base/Professor/home/HomeProfessor'
import PerfilProfessor from './pages/base/Professor/perfilProfessor/PerfilProfessor'
import ListarPEDEMIProfessor from './pages/base/Professor/listarPED_EMI/ListarPED_EMIProfessor'
import PlanoEstudos from './pages/base/Professor/planoEstudos/planoEstudos'
import AtividadesDesenvolvidas from './pages/base/Professor/atividadesDesenvolvidas/atividadesDesenvolvidas'
import AdicionarAtividade from './pages/base/Professor/atividadesDesenvolvidas/adicionarAtividade/adicionarAtividade'
import DetalhesAtividade from './pages/base/Professor/atividadesDesenvolvidas/detalhesAtividade/detalhesAtividade'
import DetalhesPEDProfessor from './pages/base/Professor/detalhesPED/DetalhesPEDProfessor'
import DetalhesPlanoEstudos from './pages/base/Professor/detalhesPlanoEstudos/DetalhesPlanoEstudos'

// Filhos de Aluno
import PerfilAluno from './pages/base/Aluno/perfilAluno/PerfilAluno'
import HomeAluno from './pages/base/Aluno/home/HomeAluno'
import ListarPPT from './pages/base/Gestao/listarPPT/ListarPPT'
import ListarPEDEMI from './pages/base/Gestao/listarPED_EMI/ListarPED_EMI'
import ListarPEDProEJA from './pages/base/Gestao/listarPED_ProEJA/ListarPED_ProEJA'
import ListarPEDProEJAProfessor from './pages/base/Professor/listarPED_ProEJAProfessor/ListarPED_ProEJAProfessor'
import DetalhesCurso from './pages/base/Gestao/detalhesCurso/DetalhesCurso'
import EditarDisciplina from './pages/base/Gestao/editarDisciplina/EditarDisciplina'


const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    // Rotas do perfil de Gestao Escolar
    {
        path: '/sessao/Gestão Escolar/',
        element: <BaseGestao />,
        children: [
            {
                path: ':idUsuario/',
                element: <HomeGestao />
            },
            {
                path: ':idUsuario/cadastroCurso',
                element: <CadastroCurso />
            },
            {
                path: ':idUsuario/cadastroServidor',
                element: <CadastroServidor />
            },
            {
                path: ':idUsuario/cadastroAluno',
                element: <CadastroAluno />
            },
            {
                path: ':idUsuario/cadastroDisciplina',
                element: <CadastroDisciplina />
            },
            {
                path: ':idUsuario/cadastroPED',
                element: <CadastroPED />
            },
            {
                path: ':idUsuario/servidores',
                element: <ListarServidor />
            },
            {
                path: ':idUsuario/cursos',
                element: <ListarCurso />
            },
            {
                path: ':idUsuario/cursos/:idCurso',
                element: <DetalhesCurso />
            },
            {
                path: ':idUsuario/cursos/:idCurso/editar',
                element: <CadastroCurso />
            },
            {
                path: ':idUsuario/disciplinas',
                element: <ListarDisciplina />
            },
            {
                path: ':idUsuario/disciplinas/:idDisciplina/editar',
                element: <EditarDisciplina />
            },
            {
                path: ':idUsuario/eventoCalendario',
                element: <EventoCalendarioPage />
            },
            {
                path: ':idUsuario/calendario/evento/:idEvento',
                element: <EventoCalendarioPage />
            },
            {
                path: ':idUsuario/calendario',
                element: <CalendarioPage />
            },
            {
                path: ':idUsuario/cadastroCalendarioAcademico',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: ':idUsuario/editarCalendarioAcademico/:idCalendario',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: ':idUsuario/listarCalendariosAcademicos',
                element: <ListarCalendariosAcademicosPage />
            },
            {
                path: ':idUsuario/servidores/:idServidor',
                element: <DetalhesServidor />
            },
            {
                path: ':idUsuario/cadastroPPT',
                element: <CadastroPPT />
            },
            {
                path: ':idUsuario/ppts',
                element: <ListarPPT />
            },
            {
                path: ':idUsuario/peds-emi',
                element: <ListarPEDEMI />
            },
            {
                path: ':idUsuario/peds-proeja',
                element: <ListarPEDProEJA />
            },
            {
                path: ':idUsuario/ppts/:idPpt',
                element: <DetalhesPPT />
            },
            {
                path: ':idUsuario/ppts/:idPpt/editar',
                element: <CadastroPPT />
            },
            {
                path: ':idUsuario/peds-emi/:pedId',
                element: <DetalhesPED />
            },
            {
                path: ':idUsuario/peds-proeja/:pedId',
                element: <DetalhesPED />
            },
            {
                path: ':idUsuario/peds-emi/:pedId/editar',
                element: <CadastroPED />
            },
            {
                path: ':idUsuario/peds-proeja/:pedId/editar',
                element: <CadastroPED />
            },
            {
                path: ':idUsario/peds-proeja/:pedId/planoEstudos',
                element: <PlanoEstudos />
            },
            {
                path: ':idUsuario/servidores/:idServidor/editar',
                element: <CadastroServidor />
            },
            {
                path: ':idUsuario/alunos',
                element: <ListarAluno />
            },
            {
                path: ':idUsuario/alunos/:idAluno',
                element: <DetalhesAluno />
            },

        ]
        // Adicionar outros caminhos que vão derivar da tela de home após autenticação

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
            {
                path: ':idUsuario/listarPPTregistro',
                element: <ListarPPTRegistro />
            }
        ]
    },
    // Rotas de Coordenador
    {
        path: '/sessao/Coordenador/',
        element: <BaseCoordenador />,
        // adicionar abaixo, as children de coordenador
    },
    // Rotas de Professor
    {
        path: '/sessao/Professor/',
        element: <BaseProfessor />,
        // adicionar abaixo, as children de professor
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
                path: ':idUsuario/peds-emi/',
                element: <ListarPEDEMIProfessor />
            },
            {
                path: ':idUsuario/peds-proeja/',
                element: <ListarPEDProEJAProfessor />
            },
            {
                path: ':idUsuario/peds-emi/:pedId',
                element: <DetalhesPEDProfessor />
            },
            {
                path: ':idUsuario/peds-emi/:pedId/detalhesPlanoEstudos',
                element: <DetalhesPlanoEstudos />
            },
            {
                path: ':idUsuario/peds-proeja/:pedId',
                element: <DetalhesPEDProfessor />
            },
            {
                path: ':idUsuario/peds-emi/:pedId/planoEstudos',
                element: <PlanoEstudos />
            },
            {
                path: ':idUsuario/peds-proeja/:pedId/planoEstudos',
                element: <PlanoEstudos />
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:pedId',
                element: <AtividadesDesenvolvidas />
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:pedId/adicionarAtividade',
                element: <AdicionarAtividade />,
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:pedId/detalhes/:atividadeId',
                element: <DetalhesAtividade />
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:pedId/editarAtividade/:atividadeId',
                element: <AdicionarAtividade />,
            }


        ]
    },
    // Rotas de Aluno
    {
        path: '/sessao/Aluno/',
        element: <BaseAluno />,
        // adicionar abaixo, as children de aluno
        children: [
            {
                path: ':idUsuario/',
                element: <HomeAluno />
            },
            {
                path: ':idUsuario/perfil',
                element: <PerfilAluno />
            },
        ]
    },
])

export default router