import React from "react";
import logo from "../../assets/logo-ifrs.png";
import PageContainer from "../../components/PageContainer/PageContainer";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"; // Certifique-se de que esse caminho esteja correto
import "./LoginPage.css";
import {authService} from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = () => {
  const redirect = useNavigate()

  const handleSuccess = async(response) => {
    // Envia a credencial do google (jwt) para ser decodificada no backend
    const res = await authService.login(response)
    
    try {
      if (res.status === 400) throw new Error(res)
        // adiciona o token jwt contendo os dados do cliente ao session storage
        sessionStorage.setItem('token', res.data.token)

        const decoded = jwtDecode(res.data.token)

        // redireciona os usuários professores e alunos para preenchimento de informações adicionais de perfil no primeiro login
        if (decoded.primeiroLogin === true && (decoded.perfil === 'Aluno' || decoded.perfil === 'Professor')) {
          redirect(`sessao/${decoded.perfil}/${decoded.idUsuario}/perfil`)
        } else {
          // redireciona os usuários para sua respectiva página home após o primeiro login
          redirect(`sessao/${decoded.perfil}/${decoded.idUsuario}`)
        }
  
    } catch (error) {
        handleFailure(res)
    }
  }

  const handleFailure = (response) => {
     toast.error(response.response.data.mensagem, {
      position: "bottom-center",
      style: { backgroundColor: '#ff0000', color: '#fff', textAlign: 'center' },
      progressStyle: { backgroundColor: '#fff' },
      icon: <FontAwesomeIcon icon={faBan} color='white' />
    });
  }

  return (
    <>
    <ToastContainer/>
    <PageContainer usuario={{}}>
        <div className="login-container">
          <h1 className="login-title">Sistema de Dependências</h1>
          <div className="login-content">
            <div className="login-left">
              <img src={logo} alt="Logo Campus" className="login-logo" />
            </div>
            <div className="login-divider" />
            <div className="login-right">
              <h2>Acesse sua Conta</h2>
              <GoogleLoginButton handleLogin={handleSuccess} handleLoginFailure={handleFailure}/>
            </div>
          </div>
        </div>
    </PageContainer>
    </>
  );
};

export default LoginPage;
