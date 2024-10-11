import React from "react";
import "./GoogleLoginButton.css";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

// Componente GoogleLoginButton:
const GoogleLoginButton = () => {
  const redirect = useNavigate()

  const handleLogin = (response) => {
    console.log(response)
    // // URL para a autenticação do Google.
    // const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    // // URI de redirecionamento após a autenticação.
    // const REDIRECT_URI = `http://127.0.0.1:8000/auth/api/login/google/`;

    // console.log();
    // // Escopos que definem as permissões solicitadas.
    // const scope = [
    //   "https://www.googleapis.com/auth/userinfo.email", // Permissão para acessar o email do usuário.
    //   "https://www.googleapis.com/auth/userinfo.profile", // Permissão para acessar o perfil do usuário.
    // ].join(" "); // Junta os escopos em uma única string.

    // // Parâmetros para a solicitação de autenticação.
    // const params = {
    //   response_type: "code", // Tipo de resposta, aqui indica que um código de autorização será retornado.
    //   client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID, // ID do cliente OAuth2 da aplicação.
    //   redirect_uri: REDIRECT_URI, // URI para onde o Google redirecionará após a autenticação.
    //   prompt: "select_account", // Solicita ao usuário que selecione uma conta.
    //   access_type: "offline", // Indica que um token de atualização deve ser obtido.
    //   scope, // Os escopos definidos anteriormente.
    // };

    // // Converte os parâmetros em uma string de consulta (query string).
    // const urlParams = new URLSearchParams(params).toString();
    // // Redireciona o usuário para a URL de autenticação do Google com os parâmetros.
    // window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    redirect(`secao/${response.data.id}`)
  };

  const handleLoginFailure = () => {
    redirect(`/login`)
  }

  return (
    // Renderiza um botão que inicia o processo de login com o Google.
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID}>
              <GoogleLogin
                  onSuccess={handleLogin}
                  onError={handleLoginFailure}
              />
        </GoogleOAuthProvider>
    // <button className="google-login-button" onClick={onGoogleLoginSuccess}>
    //   <img src={googleIcon} alt="Google Icon" className="google-icon" />
    //   Google
    // </button>
  );
};

export default GoogleLoginButton;
