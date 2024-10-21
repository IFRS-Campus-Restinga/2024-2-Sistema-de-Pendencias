import { createBrowserRouter } from 'react-router-dom'
// import das telas base de cada perfil
import BaseGestao from './pages/base/Gestao/BaseGestao'
import BaseRegistro from './pages/base/Registro/BaseRegistro'
import BaseCoordenador from './pages/base/Coordenador/BaseCoordenador'
import BaseProfessor from './pages/base/Professor/BaseProfessor'
import BaseAluno from './pages/base/Aluno/BaseAluno'
// import dos filhos de cada tela
import LoginPage from './pages/login/LoginPage'
import CadastroCurso from './pages/base/Gestao/cadastroCurso/CadastroCurso'
import CadastroServidor from './pages/base/Gestao/cadastroServidor/CadastroServidor'
import CadastroAluno from './pages/base/Gestao/cadastroAluno/CadastroAluno'
import HomeGestao from './pages/base/Gestao/home/HomeGestao'

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
            }
        ]
    },
    // Rotas do perfil de Registro Escolar
    {
        path: '/sessao/RegistroEscolar/:idUsuario',
        element: <BaseRegistro />,
    },
    // Rotas do perfil de Coordenador
    {
        path: '/sessao/Coordenador/:idUsuario',
        element: <BaseCoordenador />
    },
    // Rotas do perfil de Professor
    {
        path: '/sessao/Professor/:idUsuario',
        element: <BaseProfessor />
    },
    // Rotas do perfil de Aluno
    {
        path: '/sessao/Aluno/:idUsuario',
        element: <BaseAluno />
    }
])

export default router