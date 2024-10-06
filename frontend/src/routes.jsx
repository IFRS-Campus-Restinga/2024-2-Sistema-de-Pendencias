import { createBrowserRouter } from 'react-router-dom';
import CadastroCurso from './pages/cadastroCurso/pageCurso';
import HomeSemAutentic from './pages/home/homeSemAutentic';
import HomeAutentic from './pages/home/homeAutentic';
import LoginPage from './pages/LoginPage/LoginPage'; // Importe sua página de login

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeSemAutentic />,
  },
  {
    path: '/login', // Rota para a página de login
    element: <LoginPage />, // Renderiza o componente LoginPage
  },
  {
    path: '/secao/:idUsuario',
    element: <HomeAutentic />,
    children: [
      {
        path: 'cadastroCurso',
        element: <CadastroCurso />,
      },
      // Outras rotas aninhadas
    ],
  },
]);

export default router;