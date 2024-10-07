import { createBrowserRouter } from 'react-router-dom'
//import CadastroCurso from './pages/cadastroCurso/pageCurso'
import HomeSemAutentic from './pages/home/homeSemAutentic'
import HomeAutentic from './pages/home/homeAutentic'
import CadastroServidor from './pages/cadastroServidor/pageCadastroServidor'

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
        path: '/secao/:idUsuario',
        element: <HomeAutentic/>,
        // children: [
        //     {
        //         path: '/cadastroCurso',
        //         element: <CadastroCurso/>
        //     },
        //     // Adicionar outros caminhos que vão derivar da tela de home após autenticação
        // ]
        
        
    },
    {
        path: '/cadastroServidor',
        element: <CadastroServidor/>
    }
])

export default router