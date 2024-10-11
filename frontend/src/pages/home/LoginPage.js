import React, { useEffect, useState } from "react";
import logo from "../../assets/logo-ifrs.png";
import PageContainer from "../../components/PageContainer/PageContainer";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"; // Certifique-se de que esse caminho esteja correto
import "./LoginPage.css";
import { loginService } from "../../services/loginService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [erro, setErro] = useState('')
  const redirect = useNavigate()

  const handleSuccess = async(response) => {
    console.log(response)
    const res = await loginService.login(response)

    if (res.status !== 200) handleFailure(res)
    
    // localStorage.setItem('permission', res.data.permission)
    // localStorage.setItem('csrfToken', res.data.csrfToken)

    // redirect(`/secao/${res.data.id}`)
  }

  const handleFailure = (response) => {
    setErro(response.erro)
  }

  useEffect(() => {

  }, [erro])

  return (
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
              {/* {error && <p style={{ color: "red" }}>{error}</p>}{" "} */}
              {/* Exibe mensagem de erro */}
              <GoogleLoginButton handleLogin={handleSuccess} handleLoginFailure={handleFailure}/>
              {erro ? (
                <span className="mensagemErro">{erro}</span>
                ) : (
                  <></>
              )}
            </div>
          </div>
        </div>
    </PageContainer>
  );
};

export default LoginPage;
