import React from "react";
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Header = ({greeting, title, titleButton, showBellIcon}) => {
  const handleLogout = () => {
    alert("Você saiu!");
  };
  return (
    <header>
      <img src={logo} alt="Logo do Site" className="logo" />
      <div className="menu">
        <div className="header">
          <h1 id="header-title">
          {greeting} <span id="header-span">{title}</span>
          </h1>
          <button onClick={handleLogout} id="button-logout">
            {titleButton}
          </button>
          {showBellIcon && (
          <button>
            <FontAwesomeIcon icon={faBell} id="bell-icon" />{" "}
          </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
