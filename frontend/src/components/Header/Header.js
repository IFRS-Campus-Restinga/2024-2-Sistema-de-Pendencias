import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { authService } from '../../../src/services/authService'
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [nome, setNome] = useState()
  const redirect = useNavigate()

  const handleLogout = async () => {
    const res = await authService.logout()

    console.log(res)

    if (res.status === 200) {
      sessionStorage.clear()
      escreveNome()

      redirect('/')
    }

    else return
  };

  const escreveNome = () => {
    const token = sessionStorage.getItem('token')

    try {
      if (!token) throw new Error('Token inválido')
      
      const decoded = jwtDecode(token)
      setNome(`${decoded.primeiroNome} ${decoded.ultimoNome}`)
      
    } catch (error) {
        return error
    }
  }

  useEffect(() => {
    escreveNome()
  }, [nome])

  return (
    <header>
      <img src={logo} alt="Logo do Site" className="logo" />
      <div className="menu">
        {typeof nome === 'string' ? (
          <div className="header">
            <h1 id="header-title">Bem vindo <p className="nome">{nome}</p>!</h1>
            <button onClick={handleLogout} id="button-logout">
              Logout
            </button>
            <button>
              <FontAwesomeIcon icon={faBell} id="bell-icon" />{" "}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;
