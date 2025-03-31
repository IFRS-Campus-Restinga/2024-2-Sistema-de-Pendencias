import React from "react";
import logo from "../../assets/logo-ifrs.png";
import PageContainer from "../../components/PageContainer/PageContainer";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import styles from "./LoginPage.module.css";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = () => {
  const redirect = useNavigate()

  const handleSuccess = async (response) => {
    const res = await authService.login(response)

    try {
      if (res.status === 400) throw new Error(res)
      sessionStorage.setItem('token', res.data.token)

      const decoded = jwtDecode(res.data.token)

      if (decoded.primeiroLogin === true && (decoded.grupo === 'Aluno' || decoded.grupo === 'Professor')) {
        redirect(`sessao/${decoded.grupo}/${decoded.idUsuario}/perfil`)
      } else {
        redirect(`sessao/${decoded.grupo}/${decoded.idUsuario}`)
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
      <ToastContainer />
      <PageContainer usuario={{}}>
        <div className={styles.loginContainer}>
          <h1 className={styles.titulo}>Sistema de Gerenciamento de Progressões</h1>
          <div className={styles.conteudo}>
            <div className={styles.esquerda}>
              <img src={logo} alt="Logo Campus" className={styles.logo} />
            </div>
            <div className={styles.divisor} />
            <div className={styles.direita}>
              <h2>Acesse sua Conta</h2>
              <GoogleLoginButton handleLogin={handleSuccess} handleLoginFailure={handleFailure} />
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default LoginPage;
