// File 1: /frontend/src/components/GoogleLoginButton/GoogleLoginButton.js

import React from "react";
import "./GoogleLoginButton.css";
import googleIcon from "../../assets/google-icon.png";
import { useGoogleLogin } from '@react-oauth/google'; // Importação para usar o login personalizado
import { useNavigate } from "react-router-dom";
import loginService from "../../services/loginService";


const GoogleLoginButton = ({ handleLogin, handleLoginFailure }) => {
  
  // Usando o hook useGoogleLogin
  const login = useGoogleLogin({
    onSuccess: handleLogin,
    onError: handleLoginFailure,
  });
  
// Componente GoogleLoginButton:
  return (
    <button className="google-login-button" onClick={() => login()}>
      <img src={googleIcon} alt="Google Icon" className="google-icon" />
      Google
    </button>
  );
};

export default GoogleLoginButton;
