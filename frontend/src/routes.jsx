import { createBrowserRouter } from 'react-router-dom'
import CadastroCurso from './pages/CadastroCurso/pageCurso'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>
    },
    {
        path: '/cadastroCurso',
        element: <CadastroCurso/>
    }
])