import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import styles from "./Header.module.css";
import logo from "../../assets/logo-ifrs-branco.png";
import Dropdown from '../Dropdown/Dropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { authService } from '../../services/authService'
import { useNavigate } from "react-router-dom";
import Notificacoes from "../Notificacoes/Notificacoes";

const Header = ({ homeUrl }) => {
  const [notificAberta, setNotificAberta] = useState(false)
  const [nome, setNome] = useState()
  const redirect = useNavigate()

  const handleLogout = async () => {
    const res = await authService.logout()

    if (res.status === 200) {
      sessionStorage.clear()
      Cookies.remove('csrftoken', { path: '/', domain: '127.0.0.1' });
      Cookies.remove('sessionid', { path: '/', domain: '127.0.0.1' });

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
      setNome(`${decoded.nome}`)

    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    escreveNome()
  }, [])

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo do Site" className={styles.logo} />
      {
        sessionStorage.getItem('token') ? (
          <div className={styles.menu}>
            <span className={styles.titulo}>
              <h2 className={styles.saudacao}>
                Bem vindo,
              </h2>
              <p className={styles.nome}>{nome}</p>
              <p className={styles.grupo}>({jwtDecode(sessionStorage.getItem('token')).grupo})</p>
            </span>
            <Dropdown
              tipo={'usuario'}
              icone={
                <img src={jwtDecode(sessionStorage.getItem('token')).fotoPerfil} className={styles.fotoPerfil} />
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
            <button className={styles.botaoNotificacao}>
              <FontAwesomeIcon icon={faBell} color="white" size="xl" onClick={() => setNotificAberta(!notificAberta)} />
              {
                notificAberta ? (
                  <Notificacoes />
                ) : (
                  <></>
                )
              }
            </button>
          </div>
        ) : (
          <></>
        )
      }
    </header>
  );
};

export default Header;
