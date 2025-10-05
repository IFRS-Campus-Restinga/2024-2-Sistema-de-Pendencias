import { createBrowserRouter } from 'react-router-dom'
// Tela de Login
import AuthPage from './pages/auth/AuthPage'
import LoginPage from './pages/login/LoginPage'

// import das telas base de cada perfil
import BaseGestao from './pages/base/Gestao/BaseGestao'
// import BaseRegistro from './pages/base/Registro/BaseRegistro'
// import BaseCoordenador from './pages/base/Coordenador/BaseCoordenador'
// import BaseProfessor from './pages/base/Professor/BaseProfessor'
// import BaseAluno from './pages/base/Aluno/BaseAluno'

// Filhos de Gestao
import HomeGestao from './pages/base/Gestao/home/HomeGestao'

// Grupos & Permissoes
import GrupoLista from './pages/base/Gestao/grupoLista/GrupoLista'
import GrupoForm from './pages/base/Gestao/grupoForm/GrupoForm'
import UsuarioLista from './pages/base/Gestao/usuarioLista/UsuarioLista'

// PED
import ListarPEDGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPEDGestao'

// PPT
import ListarPPTGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPPTGestao'
import CadastroPED from './pages/base/Gestao/PEDForm/PEDForm'
import UsuarioForm from './pages/base/Gestao/usuarioForm/UsuarioForm'
import Home from './pages/home/Home'
import DetalhesPEDGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPEDGestao'
import CadastroPPT from './pages/base/Gestao/PPTForm/PPTForm'
import DetalhesPPTGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPPTGestao'

// Plano Estudos

// Atividades

// Filhos de Registro

// Filhos de Coordenador

// Filhos de Professor

// Filhos de Aluno

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: 'session/',
        element: <LoginPage/>
    },
    {
        path: 'session/auth/',
        element: <AuthPage />,
    },
    // Rotas do perfil de Gestao Escolar
    {
        path: 'session/gestao_escolar',
        element: <BaseGestao />,
        children: [
            {
                path: 'home/',
                element: <HomeGestao />
            },
            {
                path: 'grupos/cadastro/',
                element: <GrupoForm/>
            },
            {
                path: 'grupos/',
                element: <GrupoLista/>
            },
            {
                path: 'grupos/:grupoId/editar/',
                element: <GrupoForm/>
            },
            {
                path: 'alunos/',
                element: <UsuarioLista/>
            },
            {
                path: 'servidores/',
                element: <UsuarioLista/>
            },
            {
                path: 'servidores/cadastro/',
                element: <UsuarioForm/>,
            },
            {
                path: 'alunos/cadastro/',
                element: <UsuarioForm/>
            },
            {
                path: 'alunos/:alunoId/editar/',
                element: <UsuarioForm/>
            },
            {
                path: 'servidores/:servidorId/editar/',
                element: <UsuarioForm/>
            },
            // {
            //     path: '/gestao_escolar/calendarios',
            //     element: <ListarCalendario />
            // },
            // {
            //     path: '/gestao_escolar/calendarios/:idCalendario/',
            //     element: <Calendario />
            // },
            {
                path: 'peds/cadastro',
                element: <CadastroPED />
            },
            {
                path: 'peds/Integrado',
                element: <ListarPEDGestao />
            },
            {
                path: 'peds/ProEJA',
                element: <ListarPEDGestao />
            },
            {
                path: 'peds/Integrado/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: 'peds/ProEJA/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: 'peds/Integrado/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: 'peds/ProEJA/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: 'ppts/cadastro',
                element: <CadastroPPT />
            },
            {
                path: 'ppts',
                element: <ListarPPTGestao />
            },
            {
                path: 'ppts/:idPpt',
                element: <DetalhesPPTGestao />
            },
            // {
            //     path: '/gestao_escolar/peds/:modalidade/:idPed/planoEstudos/:planoId/',
            //     element: <DetalhesPlanoEstudos />
            // },
            // {
            //     path: '/gestao_escolar/atividades/:pedTipo/:idPed',
            //     element: <AtividadesDesenvolvidasGestao />
            // },
            // {
            //     path: '/gestao_escolar/atividades/:pedTipo/:idPed/detalhes/:atividadeId',
            //     element: <DetalhesAtividadeGestao />
            // },
        ]
    },
    // Rotas de Registro Escolar
    // {
    //     path: '/sessao/Registro Escolar/',
    //     element: <BaseRegistro />,
    //     children: [
    //         {
    //             path: ':idUsuario/',
    //             element: <HomeRegistro />
    //         },
    //             {
    //                 path: ':idUsuario/listarPPTregistro',
    //                 element: <ListarPPT />
    //             }
    //     ]
    // },
    // Rotas de Coordenador
    // {
    //     path: '/sessao/Coordenador/',
    //     element: <BaseCoordenador />,
    //     // adicionar abaixo, as children de coordenador
    //     children: [
    //         {
    //             path: ':idUsuario/',
    //             element: <HomeCoordenador />
    //         },
    //         {
    //             path: ':idUsuario/peds/Integrado',
    //             element: <ListarPEDEMICoordenador />
    //         },
    //         {
    //             path: ':idUsuario/peds/ProEJA/',
    //             element: <ListarPEDProEJACoordenador />
    //         },
    //         {
    //             path: ':idUsuario/peds/Integrado/:idPed',
    //             element: <DetalhesPEDCoordenador />
    //         },
    //         {
    //             path: ':idUsuario/peds/ProEJA/:pedId',
    //             element: <DetalhesPEDCoordenador />
    //         },

    //     ]
    // },
    // Rotas de Professor
    // {
    //     path: '/sessao/Professor/',
    //     element: <BaseProfessor />,
    //     //   adicionar abaixo, as children de professor
    //     children: [
    //         {
    //             path: ':idUsuario/',
    //             element: <HomeProfessor />

    //         },
    //         {
    //             path: ':idUsuario/atividades/',
    //             element: <ListarAtividadesProfessor />
    //         },
    //         {
    //             path: ':idUsuario/atividades/:atividadeId/editar',
    //             element: <CadastroAtividade />
    //         },
    //         {
    //             path: ':idUsuario/peds/:modalidade/',
    //             element: <ListarPEDProfessor />
    //         },
    //         {
    //             path: ':idUsuario/peds/:modalidade/:pedId',
    //             element: <DetalhesPEDProfessor />
    //         },
    //         {
    //             path: ':idUsuario/peds/:modalidade/:pedId/planoEstudos',
    //             element: <CadastroPlanoEstudos />
    //         },
    //         {
    //             path: ':idUsuario/peds/:modalidade/:pedId/planoEstudos/:planoId/',
    //             element: <CadastroPlanoEstudos />
    //         },
    //         {
    //             path: ':idUsuario/cadastroAtividade/',
    //             element: <CadastroAtividade />
    //         },
    //         {
    //             path: ':idUsuario/peds/:modalidade/:pedId/atividades',
    //             element: <AtividadesPEDProfessor />
    //         },
    //         {
    //             path: ':idUsuario/adicionarObservacao',
    //             element: <AdicionarObservacao />
    //         },
    //         {
    //             path: ':idUsuario/observacoes/:pedTipo/:pedId/:idObservacao',
    //             element: <DetalhesObservacoes />
    //         },
    //         {
    //             path: ':idUsuario/observacoes/:pedTipo/:pedId',
    //             element: <ListarObservacoes />
    //         },
    //         {
    //             path: ':idUsuario/editarObservacao/:idObservacao',
    //             element: <AdicionarObservacao />,
    //         },
    //     ]
    // },
    //   Rotas de Aluno
    // {
    //     path: '/sessao/Aluno/',
    //     element: <BaseAluno />,
    //     //   adicionar abaixo, as children de aluno
    //     children: [
    //         {
    //             path: ':idUsuario/',
    //             element: <HomeAluno />
    //         },
    //         {
    //             path: ':idUsuario/:modalidade/:pedId/detalhes',
    //             element: <DetalhesDependenciaAluno />
    //         },
    //         {
    //             path: ':idUsuario/:modalidade/:pedId/detalhes/atividades',
    //             element: <ListarAtividadesAluno />
    //         },
    //         {
    //             path: ':idUsuario/:modalidade/:pedId/detalhes/atividades/:atividadeId',
    //             element: <DetalhesAtividadeAluno />
    //         }
    //     ]
    // },
])

export default router