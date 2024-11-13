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
import ListarCurso from './pages/base/Gestao/listarCurso/ListarCurso'
import CalendarioPage from "./pages/base/Gestao/calendario/calendario"
import DetalhesServidor from './pages/base/Gestao/detalhesServidor/DetalhesServidor'
import EditarServidor from './pages/base/Gestao/editarServidor/EditarServidor'
import DetalhesPPT from './pages/base/Gestao/detalhesPPT/detalhesPPT'
import EditarPPT from './pages/base/Gestao/editarPPT/editarPPT'

// Filhos de Registro

// Filhos de Coordenador

// Filhos de Professor
import HomeProfessor from './pages/base/Professor/home/HomeProfessor'
import PerfilProfessor from './pages/base/Professor/perfilProfessor/PerfilProfessor'
import ListarPEDProfessor from './pages/base/Professor/perfilProfessor/listarPED/ListarPEDProfessor'
import PlanoEstudos from './pages/base/Professor/planoEstudos/planoEstudos'
import AtividadesDesenvolvidas from './pages/base/Professor/atividadesDesenvolvidas/atividadesDesenvolvidas'

// Filhos de Aluno
import PerfilAluno from './pages/base/Aluno/perfilAluno/PerfilAluno'
import HomeAluno from './pages/base/Aluno/home/HomeAluno'
import CadastroPPT from './pages/base/Gestao/cadastroPPT/cadastroPPT'
import ListarPPT from './pages/base/Gestao/listarPPT/ListarPPT'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    // Rotas do perfil de Gestao Escolar
    {
        path: '/sessao/GestaoEscolar/',
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
                path: ':idUsuario/listaServidor',
                element: <ListarServidor />
            },
            {
                path: ':idUsuario/listaCurso',
                element: <ListarCurso />
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
                path: ':idUsuario/listaServidor/:idServidor/detalhesServidor',
                element: <DetalhesServidor />
            },
            {
                path: ':idUsuario/cadastroPPT',
                element: <CadastroPPT />
            },
            {
                path: ':idUsuario/listaPPT',
                element: <ListarPPT />
            },
            {
                path: ':idUsuario/detalhesPPT/:idPpt',
                element: <DetalhesPPT />
            },
            {
                path: ':idUsuario/detalhesPPT/:idPpt/editarPPT',
                element: <EditarPPT />
            },
            {
                path: ':idUsuario/editarServidor/:idServidor',
                element: <CadastroServidor />
            },
        ]
        // Adicionar outros caminhos que vão derivar da tela de home após autenticação

    },
    // Rotas de Registro Escolar
    {
        path: '/sessao/RegistroEscolar/',
        element: <BaseRegistro />,
        // adicionar abaixo, as children de registro
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
                path: ':idUsuario/minhasPEDs/',
                element: <ListarPEDProfessor />
            },
            {
                path: ':idUsuario/ped/:pedId/planoEstudos',
                element: <PlanoEstudos />
            },
            {
                path: ':idUsuario/atividades/:pedId',
                element: <AtividadesDesenvolvidas />,
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