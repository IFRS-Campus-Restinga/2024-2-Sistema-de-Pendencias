import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import Dropdown from '../../../components/Dropdown/Dropdown'
import { validaUsuario } from "../validaUsuario";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarDays, faClipboardList, faHouse, } from "@fortawesome/free-solid-svg-icons";

const BaseGestao = ({ usuario }) => {
  const redirect = useNavigate()
  const [homeUrl, setHomeUrl] = useState('')
  const url = useLocation()

    const validaGestao = () => {
      const res = validaUsuario('Registro')

      if (!res.status) {
          if (res.perfil === undefined) redirect('/')
          else redirect(`/sessao/${res.perfil}/${res.idUsuario}`)
      }
    }

    useEffect(() => {
        validaGestao()
        setHomeUrl(url.pathname)
    },[])


  return (
    <PageContainer usuario={usuario}>
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
                <FontAwesomeIcon icon={faBook}  color="black" size="xl"/>
                <Dropdown titulo='Dependências' itens={[
                {
                name: "Consultar Dependências",
                link: `${homeUrl}/dependencias`
                },
                {
                name: "Cadastro PED - EMI",
                link: `${homeUrl}/cadastroPED_EMI`
                },
                {
                name: "Cadastro PED - PROEJA",
                link: `${homeUrl}/cadastroPED_Proeja`
                },
                {
                name: "Cadastro PPT",
                link: `${homeUrl}/cadastroPPT`
                }
                ]} />
                </div>
                <div className="navItemContainer">
                <FontAwesomeIcon icon={faCalendarDays} color="black" size="xl"/>
                <Dropdown titulo='Calendário' itens={[
                {
                name: "Calendário EMI",
                link: `${homeUrl}/calendario_EMI`
                },
                {
                name: "Calendário PROEJA",
                link: `${homeUrl}/calendario_Proeja`
                }
                ]}/>  
                </div>
                <div className="navItemContainer">
                <FontAwesomeIcon icon={faClipboardList}  color="black" size="xl"/>
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
                link: `${homeUrl}/cadastroDiscplina`
                },
                {
                name: "Cadastro Servidor",
                link: `${homeUrl}/cadastroServidor`
                }
                ]}/>  
                </div>
            </nav>
      <Outlet />
    </PageContainer>
  );
};

export default BaseGestao;
