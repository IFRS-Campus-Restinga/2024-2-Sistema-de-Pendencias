import { Link } from "react-router-dom";
import "./NavBar.css";
import Dropdown from '../Dropdown/Dropdown'
import home from "../../assets/home-preto.png";
import dependencia from "../../assets/dependencia-preto.png";
import calendario from "../../assets/calendario-preto.png";
import configuracoes from "../../assets/configuracoes-preto.png";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [id, setId] = useState('')
  const [perfil, setPerfil] = useState('')
  
  const decode = (token) => {
    try {
        const decoded = jwt_decode(token);
        setId(decoded.idUsuario)
        setPerfil(decoded.perfil)
        
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null; // Retorna null em caso de erro
    }
  };


  useEffect(() => {
    decode(sessionStorage.getItem('token'))
  }, [])

  return (
      <nav className="navBarGestao">
        <div className="navItemContainer">
          <Link to={"/secao/123456"}>
            <img
              className="icone"
              src={home}
              alt="Início"
            />
            <span className="navTexto">
              Início
            </span>
          </Link>
        </div>
        <div className="navItemContainer">
            <img
              className="icone"
              src={dependencia}
              alt="Dependências"
            />
            <Dropdown titulo='Dependências' itens={[
              {
                name: "Consultar Dependências",
                link: "dependencias"
              },
              {
                name: "Cadastro PED - EMI",
                link: "/secao/123456/CadastroEmiPed"
              },
              {
                name: "Cadastro PED - PROEJA",
                link: "/secao/123456/cadastroPED_PROEJA"
              },
              {
                name: "Cadastro PPT",
                link: "/secao/123456/cadastroPPT"
              }
            ]} />
        </div>
        <div className="navItemContainer">
            <img
              className="icone"
              src={calendario}
              alt="Calendário"
            />
            <Dropdown titulo='Calendário' itens={[
              {
                name: "Calendário EMI",
                link: "/secao/123456"
              },
              {
                name: "Calendário PROEJA",
                link: "/secao/123456"
              }
            ]}/>  
        </div>
        <div className="navItemContainer">
            <img
              className="icone"
              src={configuracoes}
              alt="Cadastros"
            />
              <Dropdown titulo='Gerenciar Cadastros' itens={[
                {
                  name: "Cadastro Aluno",
                  link: `/sessao/${perfil}/${id}/cadastroAluno`
                },
                {
                  name: "Cadastro Curso",
                  link: `/sessao/${perfil}/${id}/cadastroCurso`
                },
                {
                  name: "Cadastro Disciplina",
                  link: `/sessao/${perfil}/${id}/cadastroDisciplina`
                },
                {
                  name: "Cadastro Servidor",
                  link: `/sessao/${perfil}/${id}/cadastroServidor`
                },
                {
                  name: "Lista de Servidores",
                  link: `/sessao/${perfil}/${id}/listaServidor`
                }
              ]}/>  
          </div>
      </nav>
  );
};

export default NavBar;
