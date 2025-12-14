import { createBrowserRouter } from 'react-router-dom'
// Tela de Login
import AuthPage from './pages/auth/AuthPage'
import LoginPage from './pages/login/LoginPage'
import Home from './pages/home/Home'

// import das telas base de cada perfil
import BaseGestao from './pages/base/Gestao/BaseGestao'
import BaseCRE from './pages/base/CRE/BaseCRE'
import BaseCoordenador from './pages/base/Coordenador/BaseCoordenador'
import BaseProfessor from './pages/base/Professor/BaseProfessor'
import BaseAluno from './pages/base/Aluno/BaseAluno'

// Filhos de Gestao
import HomeGestao from './pages/base/Gestao/home/HomeGestao'

// Grupos & Permissoes
import GrupoLista from './pages/base/Gestao/grupoLista/GrupoLista'
import GrupoForm from './pages/base/Gestao/grupoForm/GrupoForm'
import UsuarioLista from './pages/base/Gestao/usuarioLista/UsuarioLista'
import UsuarioForm from './pages/base/Gestao/usuarioForm/UsuarioForm'

// PED
import CadastroPED from './pages/base/Gestao/PEDForm/PEDForm'
import ListarPEDGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPEDGestao'
import DetalhesPEDGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPEDGestao'

// PPT
import CadastroPPT from './pages/base/Gestao/PPTForm/PPTForm'
import ListarPPTGestao from './pages/base/Gestao/listarDependenciasGestao/ListarPPTGestao'
import DetalhesPPTGestao from './pages/base/Gestao/detalhesDependenciaGestao/DetalhesPPTGestao'

// Plano Estudos

// Atividades

// Filhos de CRE
import HomeCRE from './pages/base/CRE/home/HomeCRE'

// Filhos de Coordenador
import HomeCoordenador from './pages/base/Coordenador/home/HomeCoordenador'
import ListarPEDCoordenador from './pages/base/Coordenador/listarDependenciasCoordenador/ListarPEDCoordenador'
import DetalhesPEDCoordenador from './pages/base/Coordenador/detalhesDependenciaCoordenador/DetalhesPEDCoordenador'
import ListarPPTCoordenador from './pages/base/Coordenador/listarDependenciasCoordenador/ListarPPTCoordenador'
import DetalhesPPTCoordenador from './pages/base/Coordenador/detalhesDependenciaCoordenador/DetalhesPPTCoordenador'

// Filhos de Professor
import HomeProfessor from './pages/base/Professor/home/HomeProfessor'
import ListarPEDProfessor from './pages/base/Professor/listarDependenciasProfessor/ListarPEDProfessor'
import DetalhesPEDProfessor from './pages/base/Professor/detalhesPEDProfessor/DetalhesPEDProfessor'
import PlanoEstudosForm from './pages/base/Professor/planoEstudosForm/PlanoEstudosForm'
import FormEncerramentoForm from './pages/base/Professor/formEncerramentoForm/FormEncerramentoForm'
import ListarAtividadesProfessor from './pages/base/Professor/atividadeLista/AtividadeLista'
import AtividadeForm from './pages/base/Professor/atividadeForm/AtividadeForm'
import AvaliacoesPEDProfessor from './pages/base/Professor/avaliacoes/AvaliacoesPEDProfessor'

// Filhos de Aluno
import HomeAluno from './pages/base/Aluno/home/HomeAluno'
import DetalhesPPTAluno from './pages/base/Aluno/detalhesDependencia/DetalhesPPTAluno'
import DetalhesPEDAluno from './pages/base/Aluno/detalhesDependencia/DetalhesPEDAluno'
import ListarAtividadesAluno from './pages/base/Aluno/listarAtividades/ListarAtividadesAluno'
import DetalhesAtividadeAluno from './pages/base/Aluno/detalhesAtividade/DetalhesAtividadeAluno'
import DetalhesPlanoEstudosCoordenador from './pages/base/Coordenador/detalhesPlanoEstudos/DetalhesPlanoEstudosCoordenador'
import ListarAtividadesCoordenador from './pages/base/Coordenador/listaAtividadesCoordenador/ListaAtividadesCoordenador'
import DetalhesAtividadeCoordenador from './pages/base/Coordenador/detalhesAtividade/DetalhesAtividadeCoordenador'
import DetalhesFormEncerramentoCoordenador from './pages/base/Coordenador/detalhesFormEncerramento/DetalhesFormEncerramentoCoordenador'
import DetalhesPlanoEstudosGestao from './pages/base/Gestao/detalhesPlanoEstudos/DetalhesPlanoEstudosGestao'
import ListarAtividadesGestao from './pages/base/Gestao/listaAtividades/ListarAtividadesGestao'
import DetalhesAtividadeGestao from './pages/base/Gestao/detalhesAtividade/DetalhesAtividadeGestao'
import DetalhesFormEncerramentoGestao from './pages/base/Gestao/detalhesFormEncerramento/DetalhesFormEncerramentoGestao'

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
    {
        path: 'session/token/',
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
            {
                path: 'peds/:modalidade/:pedId/planoEstudos/:planoId/',
                element: <DetalhesPlanoEstudosGestao />
            },
            {
                path: 'peds/:modalidade/:pedId/atividades/',
                element: <ListarAtividadesGestao />
            },
            {
                path: 'peds/:modalidade/:pedId/atividades/:atividadeId/',
                element: <DetalhesAtividadeGestao />
            },
            {
                path: 'peds/:modalidade/:pedId/formEncerramento/:formId/',
                element: <DetalhesFormEncerramentoGestao />
            },
        ]
    },
    // Rotas de Registro Escolar
    {
        path: '/session/coord_reg_esc/',
        element: <BaseCRE />,
        children: [
            {
                path: 'home',
                element: <HomeCRE />
            },
        ]
    },
    // Rotas de Coordenador
    {
        path: '/session/coord/',
        element: <BaseCoordenador />,
        // adicionar abaixo, as children de coordenador
        children: [
            {
                path: 'home',
                element: <HomeCoordenador />
            },
            {
                path: 'peds/:modalidade/',
                element: <ListarPEDCoordenador />
            },
            {
                path: 'ppts/',
                element: <ListarPPTCoordenador />
            },
            {
                path: 'peds/:modalidade/:pedId/',
                element: <DetalhesPEDCoordenador />
            },
            {
                path: 'ppts/:pptId/',
                element: <DetalhesPPTCoordenador />
            },
            {
                path: 'peds/:modalidade/:pedId/planoEstudos/:planoId/',
                element: <DetalhesPlanoEstudosCoordenador />
            },
            {
                path: 'peds/:modalidade/:pedId/atividades/',
                element: <ListarAtividadesCoordenador />
            },
            {
                path: 'peds/:modalidade/:pedId/atividades/:atividadeId/',
                element: <DetalhesAtividadeCoordenador />
            },
            {
                path: 'peds/:modalidade/:pedId/formEncerramento/:formId/',
                element: <DetalhesFormEncerramentoCoordenador />
            },
        ]
    },
    // Rotas de Professor
    {
        path: 'session/professor/',
        element: <BaseProfessor />,
        //   adicionar abaixo, as children de professor
        children: [
            {
                path: 'home/',
                element: <HomeProfessor />
            },
            {
                path: 'atividades/:modalidade',
                element: <ListarAtividadesProfessor />
            },
            {
                path: 'atividades/cadastrar',
                element: <AtividadeForm />
            },
            {
                path: 'atividades/:modalidade/:atividadeId/editar',
                element: <AtividadeForm />
            },
            {
                path: 'peds/:modalidade/',
                element: <ListarPEDProfessor />
            },
            {
                path: 'peds/:modalidade/:pedId',
                element: <DetalhesPEDProfessor />
            },
            {
                path: 'peds/:modalidade/:pedId/planoEstudos',
                element: <PlanoEstudosForm />
            },
            {
                path: 'peds/:modalidade/:pedId/planoEstudos/:planoId/',
                element: <PlanoEstudosForm />
            },
            {
                path: 'peds/:modalidade/:pedId/formEncerramento',
                element: <FormEncerramentoForm />
            },
            {
                path: 'peds/:modalidade/:pedId/formEncerramento/:formId/',
                element: <FormEncerramentoForm />
            },
            {
                path: 'peds/:modalidade/:pedId/atividades',
                element: <AvaliacoesPEDProfessor />
            },
        ]
    },
    // Rotas de Aluno
    {
        path: '/session/aluno/',
        element: <BaseAluno />,
        //   adicionar abaixo, as children de aluno
        children: [
            {
                path: 'home',
                element: <HomeAluno />
            },
            {
                path: 'PPT/:pptId',
                element: <DetalhesPPTAluno />
            },
            {
                path: 'PED/:pedId',
                element: <DetalhesPEDAluno />
            },
            {
                path: 'PED/:pedId/atividades',
                element: <ListarAtividadesAluno />
            },
            {
                path: 'PED/:pedId/atividades/:atividadeId',
                element: <DetalhesAtividadeAluno />
            }
        ]
    },
])

export default router