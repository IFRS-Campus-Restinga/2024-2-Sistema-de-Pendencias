import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import "./Header.css";
import logo from "../../assets/logo-ifrs-branco.png";
import Dropdown from '../../components/Dropdown/Dropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { authService } from '../../../src/services/authService'
import { Link, useNavigate } from "react-router-dom";
import { notificacaoService } from "../../services/notificacaoService";

const Header = ({homeUrl}) => {
  const [notificacoes, setNotificacoes] = useState([])
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
  
  const buscar_notificacoes = async () => {
    try {
       const res = await notificacaoService.buscar(jwtDecode(sessionStorage.getItem('token')).idUsuario)
       
       if (res.status !== 200) throw new Error(res)

      setNotificacoes(res.data)
    } catch (error) {
        console.error(error)
    }
  }

  const trocar_status = async (idNotificacao) => {
      try {
        const res = await notificacaoService.trocar_status(idNotificacao)

        if (res.status !== 201) throw new Error(res)
        
        buscar_notificacoes()
      } catch (error) {
        console.error(error)
      }
  }

  const escreveNome = () => {
    const token = sessionStorage.getItem('token')

    try {
      if (!token) throw new Error('Token inválido')
      
      const decoded = jwtDecode(token)
      setNome(`${decoded.nome}`)
      
    } catch (error) {
        return error
    }
  }

  useEffect(() => {
    escreveNome()
    buscar_notificacoes()
  }, [])

  return (
    <header className="header">
      <img src={logo} alt="Logo do Site" className="logo" />
      {
        sessionStorage.getItem('token') ? (
          <div className="menu">
            <span className="header-titulo">
              <h2 className="header-saudacao">
                Bem vindo,
              </h2>
              <p className="header-nome">{nome}</p>
              <p className="header-grupo">({jwtDecode(sessionStorage.getItem('token')).grupo})</p>
            </span>
              <Dropdown 
                titulo={
                  <img src={jwtDecode(sessionStorage.getItem('token')).fotoPerfil} className="fotoPerfil"/>
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
                <FontAwesomeIcon icon={faBell} id="bell-icon" onClick={() => setNotificAberta(!notificAberta)}/>
                {
                  notificAberta ? (
                    <div className='caixaNotif'>
                      {
                        notificacoes.map((notificacao) => (
                          <Link to={notificacao.url}>
                            <span className='notificacao' onClick={() => trocar_status(notificacao.id)}>
                              <p>{new Date(notificacao.data).toLocaleDateString('pt-BR')}</p>
                              <p className="descricaoNotif">{notificacao.mensagem}</p>
                            </span>
                          </Link>
                        ))
                      }
                    </div>
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
