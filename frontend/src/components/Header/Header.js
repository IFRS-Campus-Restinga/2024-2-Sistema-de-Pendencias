import React from "react";
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import logo_pequeno from "../../assets/logo-ifrs-branco-pequeno.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = ({ usuario }) => {
  const handleLogout = () => {
    alert("Você saiu!");
  };

  return (
    <header>
      <img src={logo} alt="Logo do Site" className="logo" />
      <div className="menu">
        {usuario ? (
          <div className="header">
            <h1 id="header-title">Bem vindo {usuario.nome}!</h1>
            <button onClick={handleLogout} id="button-logout">
              Logout
            </button>
            <button>
              <FontAwesomeIcon icon={faBell} id="bell-icon" />{" "}
            </button>
          </div>
        ) : (
          <div className="header">
            <h1 id="header-title">Você ainda não se identificou.</h1>{" "}
            {/* Inserir aqui a página de login com a conta google */}
            <Link to={"/secao/123456"}>(Acessar)</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
