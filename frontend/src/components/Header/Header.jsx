import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo-ifrs-branco.png";
import Dropdown from '../Dropdown/Dropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { authService } from '../../services/authService'
import { useNavigate } from "react-router-dom";
import Notificacoes from "../Notificacoes/Notificacoes";
import { AxiosError } from "axios";
import { toast } from 'react-toastify'


const Header = () => {
  const [notificAberta, setNotificAberta] = useState(false)
  const [nome, setNome] = useState()
  const redirect = useNavigate()

  const handleLogout = async () => {
    try {
        await authService.logout()
    
        sessionStorage.clear()
    
        redirect('/session')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  };

  const escreveNome = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    try {
      if (!user) throw new Error('Token inválido')

      setNome(`${user.username}`)

    } catch (error) {
      redirect('/')
    }
  }

  useEffect(() => {
    escreveNome()
  }, [])

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo do Site" className={styles.logo} onClick={() => redirect(`/session/${JSON.parse(sessionStorage.getItem('user')).group}/home`)}/>
      {
        sessionStorage.getItem('user') ? (
          <div className={styles.menu}>
            <span className={styles.titulo}>
              <h2 className={styles.saudacao}>
                Bem vindo,
              </h2>
              <p className={styles.nome}>{nome}</p>
              <p className={styles.grupo}>{JSON.parse(sessionStorage.getItem('user')).group}</p>
            </span>
            <Dropdown
              img={JSON.parse(sessionStorage.getItem('user')).profile_picture}
              fontSize={'12px'}
              itens={[
                {
                  name: 'Logout',
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
