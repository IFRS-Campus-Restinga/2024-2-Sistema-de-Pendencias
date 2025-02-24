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
import DetalhesCurso from './pages/base/Gestao/detalhesCurso/DetalhesCurso'
import EditarDisciplina from './pages/base/Gestao/editarDisciplina/EditarDisciplina'
import ListarDisciplina from './pages/base/Gestao/listarDisciplina/ListarDisciplina'
import CalendarioPage from "./pages/base/Gestao/calendario/calendario"
import DetalhesServidor from './pages/base/Gestao/detalhesServidor/DetalhesServidor'
import ListarPEDGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPEDGestao'
import ListarPPTGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPPTGestao'
import DetalhesPEDGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPEDGestao'
import DetalhesPPTGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPPTGestao'
import CadastroPPT from './pages/base/Gestao/cadastroPPT/cadastroPPT'
import ListarAluno from './pages/base/Gestao/listarAluno/ListarAluno'
import DetalhesAluno from './pages/base/Gestao/detalhesAluno/DetalhesAluno'
import DetalhesPlanoEstudos from './pages/base/Gestao/detalhesPlanoEstudos/DetalhesPlanoEstudos'
import AtividadesDesenvolvidasGestao from './pages/base/Gestao/atividadesDesenvolvidasGestao/atividadesDesenvolvidas'
import DetalhesAtividadeGestao from './pages/base/Gestao/atividadesDesenvolvidasGestao/detalhesAtividade/detalhesAtividade'

// Filhos de Registro
import HomeRegistro from './pages/base/Registro/home/homeRegistro'

// Filhos de Coordenador
import HomeCoordenador from './pages/base/Coordenador/home/HomeCoordenador'
import PerfilCoordenador from './pages/base/Coordenador/perfilCoordenador/PerfilCoordenador'
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
            // Rotas de Servidores
            {
                path: ':idUsuario/cadastroServidor',
                element: <CadastroServidor />
            },
            {
                path: ':idUsuario/servidores',
                element: <ListarServidor />
            },
            {
                path: ':idUsuario/servidores/:idServidor',
                element: <DetalhesServidor />
            },
            {
                path: ':idUsuario/servidores/:idServidor/editar',
                element: <CadastroServidor />
            },
            {
                path: ':idUsuario/cadastroAluno',
                element: <CadastroAluno />
            },
            {
                path: ':idUsuario/alunos',
                element: <ListarAluno />
            },
            {
                path: ':idUsuario/alunos/:idAluno',
                element: <DetalhesAluno />
            },
            {
                path: ':idUsuario/cadastroCurso',
                element: <CadastroCurso />
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
                path: ':idUsuario/cadastroDisciplina',
                element: <CadastroDisciplina />
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
                path: ':idUsuario/calendario',
                element: <CalendarioPage />
            },
            {
                path: ':idUsuario/cadastroCalendarioAcademico',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: ':idUsuario/calendario/:idCalendario/editar',
                element: <CadastroCalendarioAcademicoPage />
            },
            {
                path: ':idUsuario/CalendariosAcademicos',
                element: <ListarCalendariosAcademicosPage />
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
                path: ':idUsuario/cadastroPED',
                element: <CadastroPED />
            },
            {
                path: ':idUsuario/peds/Integrado',
                element: <ListarPEDGestao />
            },
            {
                path: ':idUsuario/peds/ProEJA',
                element: <ListarPEDGestao />
            },
            {
                path: ':idUsuario/peds/Integrado/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: ':idUsuario/peds/ProEJA/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: ':idUsuario/peds/Integrado/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: ':idUsuario/peds/ProEJA/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: ':idUsuario/cadastroPPT',
                element: <CadastroPPT />
            },
            {
                path: ':idUsuario/ppts',
                element: <ListarPPTGestao />
            },
            {
                path: ':idUsuario/ppts/:idPpt',
                element: <DetalhesPPTGestao />
            },
            {
                path: ':idUsuario/ppts/:idPpt/editar',
                element: <CadastroPPT />
            },
            {
                path: ':idUsario/peds/:modalidade/:idPed/planoEstudos/:planoId/',
                element: <DetalhesPlanoEstudos />
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:idPed',
                element: <AtividadesDesenvolvidasGestao />
            },
            {
                path: ':idUsuario/atividades/:pedTipo/:idPed/detalhes/:atividadeId',
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
                path: ':idUsuario/perfil/',
                element: <PerfilCoordenador />
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
        ]
    },
])

export default router