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
  const homeUrl = `/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`
  
    const validaGestao = () => {
      const res = validaUsuario('GestaoEscolar')

      if (!res.status) {
          if (res.perfil === undefined) redirect('/')
          else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
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
        name: "Consultar Dependências",
        link: `${homeUrl}/dependencias`
        },
        {
        name: "Cadastro PED - EMI",
        link: `${homeUrl}/CadastroEmiPed`
        },
        {
        name: "Cadastro PED - PROEJA",
        link: `${homeUrl}/cadastroPED_Proeja`
        },
        {
        name: "Cadastro PPT",
        link: `${homeUrl}/cadastroPPT`
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
        name: "Cadastro Aluno",
        link: `${homeUrl}/cadastroAluno`
        },
        {
        name: "Cadastro Curso",
        link: `${homeUrl}/cadastroCurso`
        },
        {
        name: "Cadastro Disciplina",
        link: `${homeUrl}/cadastroDisciplina`
        },
        {
        name: "Cadastro Servidor",
        link: `${homeUrl}/cadastroServidor`
        }
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
