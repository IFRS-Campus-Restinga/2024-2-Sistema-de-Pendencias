import React from "react";
import "./GoogleLoginButton.css";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ handleLogin, handleLoginFailure }) => {
    return (
      <GoogleLogin onSuccess={handleLogin} onError={handleLoginFailure}/>
  );
};

export default GoogleLoginButton;
