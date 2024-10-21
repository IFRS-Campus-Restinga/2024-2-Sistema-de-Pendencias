import React from "react";
import "./GoogleLoginButton.css";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import loginService from "../../services/loginService";

// Componente GoogleLoginButton:
const GoogleLoginButton = ({handleLogin, handleLoginFailure}) => {
  return (
              <GoogleLogin onSuccess={handleLogin} onError={handleLoginFailure}/>
    // <button className="google-login-button" onClick={onGoogleLoginSuccess}>
    //   <img src={googleIcon} alt="Google Icon" className="google-icon" />
    //   Google
    // </button>
  );
};

export default GoogleLoginButton;
