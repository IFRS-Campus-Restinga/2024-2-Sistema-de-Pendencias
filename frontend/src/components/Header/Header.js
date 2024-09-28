import React from "react";
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const handleLogout = () => {
    alert("Você saiu!");
  };
  return (
    <header>
      <img src={logo} alt="Logo do Site" className="logo" />
      <div className="menu">
        <div className="header">
          <h1 id="header-title">
            Bem vindo, <span id="header-span">Gestão Escolar.</span>
          </h1>
          <button onClick={handleLogout} id="button-logout">
            Sair
          </button>
          <button>
            <FontAwesomeIcon icon={faBell} id="bell-icon" />{" "}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
