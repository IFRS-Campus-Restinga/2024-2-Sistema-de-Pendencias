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

import ListarCalendario from './pages/base/Gestao/listarCalendarios/ListarCalendarios'
import Calendario from './pages/base/Gestao/calendario/calendario'
import CadastroEvento from "./pages/base/Gestao/cadastroEvento/CadastroEvento"

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
import HomeAluno from './pages/base/Aluno/home/HomeAluno'
import CadastroAtividade from './pages/base/Professor/cadastroAtividade/CadastroAtividade'
import ListarAtividadesProfessor from './pages/base/Professor/listarAtividades/ListarAtividadesProfessor'
import DetalhesDependenciaAluno from './pages/base/Aluno/detalhesDependencia/DetalhesDependenciaAluno'
import ListarAtividadesAluno from './pages/base/Aluno/listarAtividades/ListarAtividadesAluno'
import DetalhesAtividadeAluno from './pages/base/Aluno/detalhesAtividade/DetalhesAtividadeAluno'

const router = createBrowserRouter([
    {
        path: '/redirect/',
        element: <LoginPage />,
    },
    // Rotas do perfil de Gestao Escolar
    {
        path: '/gestao_escolar',
        element: <BaseGestao />,
        children: [
            {
                path: '/gestao_escolar',
                element: <HomeGestao />
            },
            {
                path: '/gestao_escolar/calendarios',
                element: <ListarCalendario />
            },
            {
                path: '/gestao_escolar/calendarios/:idCalendario/',
                element: <Calendario />
            },
            {
                path: '/gestao_escolar/cadastroEvento/',
                element: <CadastroEvento />
            },
            {
                path: '/gestao_escolar/calendarios/:idCalendario/eventos/:idEvento/editar',
                element: <CadastroEvento />
            },
            {
                path: '/gestao_escolar/cadastroPED',
                element: <CadastroPED />
            },
            {
                path: '/gestao_escolar/peds/Integrado',
                element: <ListarPEDGestao />
            },
            {
                path: '/gestao_escolar/peds/ProEJA',
                element: <ListarPEDGestao />
            },
            {
                path: '/gestao_escolar/peds/Integrado/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: '/gestao_escolar/peds/ProEJA/:idPed',
                element: <DetalhesPEDGestao />
            },
            {
                path: '/gestao_escolar/peds/Integrado/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: '/gestao_escolar/peds/ProEJA/:idPed/editar',
                element: <CadastroPED />
            },
            {
                path: '/gestao_escolar/cadastroPPT',
                element: <CadastroPPT />
            },
            {
                path: '/gestao_escolar/ppts',
                element: <ListarPPTGestao />
            },
            {
                path: '/gestao_escolar/ppts/:idPpt',
                element: <DetalhesPPTGestao />
            },
            {
                path: '/gestao_escolar/ppts/:idPpt/editar',
                element: <CadastroPPT />
            },
            {
                path: '/gestao_escolar/peds/:modalidade/:idPed/planoEstudos/:planoId/',
                element: <DetalhesPlanoEstudos />
            },
            {
                path: '/gestao_escolar/atividades/:pedTipo/:idPed',
                element: <AtividadesDesenvolvidasGestao />
            },
            {
                path: '/gestao_escolar/atividades/:pedTipo/:idPed/detalhes/:atividadeId',
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