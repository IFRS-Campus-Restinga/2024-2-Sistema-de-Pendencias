import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/pageCurso'
import HomeSemAutentic from './pages/home/homeSemAutentic'
import HomeAutentic from './pages/home/homeAutentic'
import CadastroServidor from './pages/cadastroServidor/CadastroServidor'
import MenuGestao from './pages/menu/menuGestao'
import CadastroAluno from './pages/cadastroAluno/CadastroAluno'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeSemAutentic />,
        // children: {
        //     path: '/login',
        //     // Adicionar a tela de login
        // }
    },
    {
        path: '/secao',
        element: <HomeAutentic />,
        children: [
            {
                path: '/secao/:idUsuario',
                element: <MenuGestao />,
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
            }
            // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        ]


    },

])

export default router