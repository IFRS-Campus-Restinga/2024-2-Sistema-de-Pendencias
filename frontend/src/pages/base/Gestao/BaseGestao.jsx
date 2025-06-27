import { Link, Outlet, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import Dropdown from '../../../components/Dropdown/Dropdown'
import { validaUsuario } from "../validaUsuario";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarDays, faClipboardList, faHouse, } from "@fortawesome/free-solid-svg-icons";
import './BaseGestao.css'
import { jwtDecode } from "jwt-decode";
import { verificarGrupos } from "../../../utils/permissões";

const BaseGestao = () => {
  const redirect = useNavigate()
  const homeUrl = `/${verificarGrupos(JSON.parse(sessionStorage.getItem('user')).groups)}`

  const validaGestao = () => {
    const res = validaUsuario('gestao_escolar')

    if (!res.status) {
      if (res.grupo === undefined) redirect('/')
      else redirect(`/${res.grupo}`)
    }
  }

  useEffect(() => {
    validaGestao()
  }, [])


  return (
    <PageContainer homeUrl={homeUrl}>
      <nav className="navBarGestao">
        <div className="navItemContainer">
          <Link to={homeUrl}>
            <FontAwesomeIcon icon={faHouse} color="black" size="xl" />
            <span className="navTexto">
              Início
            </span>
          </Link>
        </div>
        <div className="navItemContainer">
          <Dropdown titulo='Dependências' itens={[
            {
              name: "Dependências - EMI",
              link: `${homeUrl}/peds/Integrado`
            },
            {
              name: "Dependências - ProEJA",
              link: `${homeUrl}/peds/ProEJA`
            },
            {
              name: "Cadastro PED",
              link: `${homeUrl}/cadastroPED`
            },
            {
              name: "Gerenciar PPT",
              link: `${homeUrl}/ppts`
            }
          ]} icone={<FontAwesomeIcon icon={faBook} color="black" size="xl" />}
          />
        </div>
        <div className="navItemContainer">
          <Dropdown titulo='Calendário' itens={[
            {
              name: "Gerenciar Calendário",
              link: `${homeUrl}/calendarios`
            }
          ]}
            icone={<FontAwesomeIcon icon={faCalendarDays} color="black" size="xl" />}
          />
        </div>
        <div className="navItemContainer">
          <Dropdown titulo='Gerenciar Cadastros' itens={[
            {
              name: "Alunos",
              link: `${homeUrl}/alunos`
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
              link: `${homeUrl}/disciplinas`
            },
          ]}
            icone={<FontAwesomeIcon icon={faClipboardList} color='black' size="xl" />}
          />
        </div>
      </nav>
      <Outlet />
    </PageContainer>
  );
};

export default BaseGestao;
