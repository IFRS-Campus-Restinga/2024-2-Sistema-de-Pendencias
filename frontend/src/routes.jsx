import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/pageCurso'
import HomeSemAutentic from './pages/home/homeSemAutentic'
import CadastroAluno from "./pages/cadastroAluno/pageCadastroAluno";
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
        path: '/cadastroAluno',
        element: <CadastroAluno/>, // Adicione a nova rota
    }
])

export default router