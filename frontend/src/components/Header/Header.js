import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import Dropdown from '../../components/Dropdown/Dropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { authService } from '../../../src/services/authService'
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({homeUrl}) => {
  const [nome, setNome] = useState()
  const redirect = useNavigate()

  const handleLogout = async () => {
    const res = await authService.logout()

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
    <header className="header">
      <img src={logo} alt="Logo do Site" className="logo" />
      <div className="menu">
        {typeof nome === 'string' ? (
          <>
            <h2 className="header-title">Bem vindo <p className="nome">{nome}</p></h2>
            <Dropdown 
              titulo={
                <img src={sessionStorage.getItem('fotoPerfil')} className="fotoPerfil"/>
              } 
                itens={[
                  {
                    name: 'Minha Conta',
                    link: `${homeUrl}/perfil`
                  },
                  {
                    name: 'Logout',
                    link: null,
                    onClick: handleLogout
                  }
              ]}
            />
            <button className="buttonNotif">
              <FontAwesomeIcon icon={faBell} id="bell-icon" />{" "}
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;
