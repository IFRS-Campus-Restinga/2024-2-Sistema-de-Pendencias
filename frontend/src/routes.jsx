import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/cadastroCurso/pageCurso'
import Home from './pages/home/home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/CadastroCurso',
        element: <CadastroCurso/>
    }
])

export default router