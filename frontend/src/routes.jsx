import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/pageCurso'
import HomeSemAutentic from './pages/home/homeSemAutentic'
import HomeAutentic from './pages/home/homeAutentic'
<<<<<<< HEAD
import CadastroServidor from './pages/cadastroServidor/pageCadastroServidor'
import MenuGestao from './pages/menu/menuGestao'
=======
>>>>>>> c2407baa83cea70b16090b6f3b42ea1a2ecdbcb8

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeSemAutentic/>,
        // children: {
        //     path: '/login',
        //     // Adicionar a tela de login
        // }
    },
    {
        path: '/secao',
        element: <HomeAutentic/>,
<<<<<<< HEAD
        children: [
            {
                path: '/secao/:idUsuario',
                element: <MenuGestao/>,
                children: [
                    {
                        path: '/secao/:idUsuario/cadastroCurso',
                        element: <CadastroCurso/>
                    },
                ]
            }
            // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        ]
        
        
    },
    {
      path: '/cadastroServidor',
      element: <CadastroServidor/>
    },

=======
        // children: [
        //     {
        //         path: '/cadastroCurso',
        //         element: <CadastroCurso/>
        //     },
        //     // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        // ]
    }
>>>>>>> c2407baa83cea70b16090b6f3b42ea1a2ecdbcb8
])

export default router