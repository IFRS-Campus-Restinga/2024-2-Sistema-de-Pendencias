import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/CadastroCurso'
import LoginPage from './pages/home/LoginPage'
import CadastroServidor from './pages/cadastroServidor/CadastroServidor'
import CadastroAluno from './pages/cadastroAluno/CadastroAluno'
import HomeGestao from './pages/home/HomeGestao'
import Saudacao from './components/Saudacao/Saudacao'
<<<<<<< HEAD
import CadastroDisciplina from "./pages/cadastroDisciplina/CadastroDisciplina"
import CadastroEmiPed from "./pages/cadastroEmiPed/cadastroEmiPed";
=======
import ListarServidor from './pages/listarServidor/ListarServidor'
>>>>>>> 980b8f1a49f7ba3fafb2c6116feef56e6f70b1bf

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
<<<<<<< HEAD
                path: '/secao/:idUsuario/cadastroDisciplina',
                element: <CadastroDisciplina />
            },
            {
                path: '/secao/:idUsuario/cadastroEmiPed',
                element: <CadastroEmiPed />
            }
=======
                path: '/secao/:idUsuario/listaServidor',
                element: <ListarServidor />
            },
>>>>>>> 980b8f1a49f7ba3fafb2c6116feef56e6f70b1bf
            // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        ]


    },

])

export default router