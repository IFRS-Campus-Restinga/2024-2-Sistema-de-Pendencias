import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/CadastroCurso'
import LoginPage from './pages/home/LoginPage'
import CadastroServidor from './pages/cadastroServidor/CadastroServidor'
import CadastroAluno from './pages/cadastroAluno/CadastroAluno'
import HomeGestao from './pages/home/HomeGestao'
import Saudacao from './components/Saudacao/Saudacao'
import CadastroDisciplina from "./pages/cadastroDisciplina/CadastroDisciplina"

const router = createBrowserRouter([
    {
        path: '',
        element: <LoginPage />,
    },

    {
        path: '/secao',
        element: <HomeGestao />,
        children: [
            {
                path: '/secao/:idUsuario',
                element: <Saudacao />
            },
            {
                path: '/secao/:idUsuario/cadastroCurso',
                element: <CadastroCurso />
            },
            {
                path: '/secao/:idUsuario/cadastroServidor',
                element: <CadastroServidor />
            },
            {
                path: '/secao/:idUsuario/cadastroAluno',
                element: <CadastroAluno />
            },
            {
                path: '/secao/:idUsuario/cadastroDisciplina',
                element: <CadastroDisciplina />
            }
            // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        ]


    },

])

export default router