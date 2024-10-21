import React from "react";
import logo from "../../assets/logo-ifrs.png";
import PageContainer from "../../components/PageContainer/PageContainer";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"; // Certifique-se de que esse caminho esteja correto
import "./LoginPage.css";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const redirect = useNavigate()

  const handleSuccess = async(response) => {
    // Envia a credencial do google (jwt) para ser decodificada no backend
    const res = await authService.login(response)
    try {
      if (res.status !== 200) throw new Error()
        // adiciona o token jwt contendo os dados do cliente ao session storage
        sessionStorage.setItem('token', res.data.token)
        sessionStorage.setItem('refresh', res.data.refresh)

        const decoded = jwtDecode(res.data.token)

        // redireciona os usuários professores e alunos para preenchimento de informações adicionais de perfil no primeiro login
        if (res.data.primeiroLogin === true && (decoded.perfil === 'Aluno' || decoded.perfil === 'Professor')) {
          redirect(`sessao/${decoded.perfil}/${decoded.idUsuario}/dadosAdicionais`)
        } else {
          // redireciona os usuários para sua respectiva página home após o primeiro login
          redirect(`sessao/${decoded.perfil}/${decoded.user_id}`)
        }
  
    } catch (error) {
        handleFailure(res)
    }
  }

  const handleFailure = (response) => {
    redirect('/')
     // Mostrar toast de sucesso
     toast.error(response.mensagem, {
      position: "bottom-center",
      autoClose: 3000,
      style: { backgroundColor: '#ff0000', color: '#fff', textAlign: 'center' },
      progressStyle: { backgroundColor: '#fff' }
    });
  }

  return (
    <PageContainer usuario={{}}>
      <ToastContainer/>
        <div className="login-container">
          <h1 className="login-title">Sistema de Dependências</h1>
          <div className="login-content">
            <div className="login-left">
              <img src={logo} alt="Logo Campus" className="login-logo" />
            </div>
            <div className="login-divider" />
            <div className="login-right">
              <h2>Acesse sua Conta</h2>
              {/* {error && <p style={{ color: "red" }}>{error}</p>}{" "} */}
              {/* Exibe mensagem de erro */}
              <GoogleLoginButton handleLogin={handleSuccess} handleLoginFailure={handleFailure}/>
            </div>
          </div>
        </div>
    </PageContainer>
  );
};

export default LoginPage;
