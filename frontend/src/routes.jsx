import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/pageCurso'
import Home from './pages/home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/cadastroCurso',
        element: <CadastroCurso/>
    }
])

export default router