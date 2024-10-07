import React, { useState } from "react";
import logo from "../../assets/logo-ifrs.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PageContainer from "../../components/PageContainer/PageContainer";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"; // Certifique-se de que esse caminho esteja correto
import "./homeSemAutentic.css";

const LoginPage = () => {
  const [error, setError] = useState(null); // Estado para gerenciar mensagens de erro

  const handleLoginSuccess = (response) => {

    console.log("Login bem-sucedido:", response);
  };

  const handleLoginError = (error) => {
    // Lógica para lidar com erro no login
    setError("Erro ao fazer login. Tente novamente."); // Mensagem de erro
    console.error("Erro de login:", error);
  };

  return (
    <PageContainer>
      <Header usuario={false} />
      <main>
        <div className="login-page">
          <div className="login-container">
            <h1 className="login-title">Sistema de Dependências</h1>
            <div className="login-content">
              <div className="login-left">
                <img src={logo} alt="Logo Campus" className="login-logo" />
              </div>
              <div className="login-divider" />
              <div className="login-right">
                <h2>Acesse sua Conta</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro */}
                <GoogleLoginButton 
                  onLoginSuccess={handleLoginSuccess} 
                  onLoginError={handleLoginError} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageContainer>
  );
};

export default LoginPage;
