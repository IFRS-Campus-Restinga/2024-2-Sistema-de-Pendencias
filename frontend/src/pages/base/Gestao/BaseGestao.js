import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import MainContainer from "../../../components/MainContainer/mainContainer"
import Dropdown from '../../../components/Dropdown/Dropdown'
import { validaUsuario } from "../validaUsuario";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarDays, faClipboardList, faHouse, } from "@fortawesome/free-solid-svg-icons";
import './BaseGestao.css'
import { jwtDecode } from "jwt-decode";

const BaseGestao = () => {
  const redirect = useNavigate()
  const homeUrl = `/sessao/${jwtDecode(sessionStorage.getItem('token')).grupo}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`
  
    const validaGestao = () => {
      const res = validaUsuario('Gestão Escolar')

      if (!res.status) {
          if (res.grupo === undefined) redirect('/')
          else redirect(`/sessao/${res.grupo}/${res.idUsuario}`)
      }
    }

    useEffect(() => {
        validaGestao()
    },[])


  return (
    <PageContainer homeUrl={homeUrl}>
      <nav className="navBarGestao">
        <div className="navItemContainer">
        <Link to={homeUrl}>
        <FontAwesomeIcon icon={faHouse} color="black" size="xl"/>
        <span className="navTexto">
        Início
        </span>
        </Link>
        </div>
        <div className="navItemContainer">
        <Dropdown titulo='Dependências' itens={[
        {
        name: "Dependências - EMI",
        link: `${homeUrl}/peds-emi`
        },
        {
        name: "Dependências - ProEJA",
        link: `${homeUrl}/peds-proeja`
        },
        {
        name: "Cadastro PED",
        link: `${homeUrl}/cadastroPED`
        },
        {
        name: "Gerenciar PPT",
        link: `${homeUrl}/ppts`
        }        
        ]} icone={<FontAwesomeIcon icon={faBook}  color="black" size="xl"/>}
        />
        </div>
        <div className="navItemContainer">
        <Dropdown titulo='Calendário' itens={[
        {
        name: "Cadastrar Eventos",
        link: `${homeUrl}/eventoCalendario`
        },
        {
        name: "Calendário",
        link: `${homeUrl}/calendario`
        }
        ]}
        icone={<FontAwesomeIcon icon={faCalendarDays} color="black" size="xl"/>}
        />  
        </div>
        <div className="navItemContainer">
        <Dropdown titulo='Gerenciar Cadastros' itens={[
        {
        name: "Alunos",
        link: `${homeUrl}/cadastroAluno`
        },
        {
        name: "Servidores",
        link: `${homeUrl}/servidores`
        },
        {
        name: "Cursos",
        link: `${homeUrl}/cursos`
        },
        {
        name: "Disciplinas",
        link: `${homeUrl}/cadastroDisciplina`
        },
        ]}
        icone={<FontAwesomeIcon icon={faClipboardList}  color='black' size="xl"/>}
        />  
        </div>
      </nav>
      <Outlet />
    </PageContainer>
  );
};

export default BaseGestao;
