import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/CadastroCurso'
import HomeSemAutentic from './pages/home/homeSemAutentic'
import HomeAutentic from './pages/home/homeAutentic'

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
        path: '/cadastroCurso',
        element: <CadastroCurso/>
    }
    // {
    //     path: '/secao/:idUsuario',
    //     element: <HomeAutentic/>,
    //      children: [
    //          {
    //              path: '/cadastroCurso',
    //             element: <CadastroCurso/>
    //          },
    //     //     // Adicionar outros caminhos que vão derivar da tela de home após autenticação
    //      ]
    // }
])

export default router