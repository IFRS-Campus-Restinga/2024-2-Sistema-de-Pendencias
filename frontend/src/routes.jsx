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
import CadastroEmiPed from "./pages/base/Gestao/cadastroEmiPed/cadastroEmiPed";
import ListarServidor from './pages/base/Gestao/listarServidor/ListarServidor'
// Filhos de Registro

// Filhos de Coordenador

// Filhos de Professor

// Filhos de Aluno


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
                path: ':idUsuario/cadastroEmiPed',
                element: <CadastroEmiPed />
            },
            {
                path: ':idUsuario/listaServidor',
                element: <ListarServidor />
            },
>>>>>>> 980b8f1a49f7ba3fafb2c6116feef56e6f70b1bf
            // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        ]
    },
    // Rotas de Registro Escolar
    {
        path: 'sessao/RegistroEscolar',
        element: <BaseRegistro />,
        // adicionar abaixo, as children de registro
    },
    // Rotas de Coordenador
    {
        path: 'sessao/Coordenador',
        element: <BaseCoordenador />,
        // adicionar abaixo, as children de coordenador
    },
    // Rotas de Professor
    {
        path: 'sessao/Professor',
        element: <BaseProfessor />,
        // adicionar abaixo, as children de professor
    },
    // Rotas de Aluno
    {
        path: 'sessao/Aluno',
        element: <BaseAluno />,
        // adicionar abaixo, as children de aluno
    },
])

export default router