import { Link } from "react-router-dom";
import "./NavBar.css";
import Dropdown from '../Dropdown/Dropdown'
import home from "../../assets/home-preto.png";
import dependencia from "../../assets/dependencia-preto.png";
import calendario from "../../assets/calendario-preto.png";
import configuracoes from "../../assets/configuracoes-preto.png";

const NavBar = () => {
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
                link: "/secao/123456/dependencias"
              },
              {
                name: "Cadastro PED - EMI",
                link: "/secao/123456/cadastroPED_EMI"
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
                  link: "/secao/123456/cadastroAluno"
                },
                {
                  name: "Cadastro Curso",
                  link: "/secao/123456/cadastroCurso"
                },
                {
                  name: "Cadastro Disciplina",
                  link: "/secao/123456"
                },
                {
                  name: "Cadastro Servidor",
                  link: "/secao/123456/cadastroServidor"
                },
                {
                  name: "Lista de Servidores",
                  link: "/secao/123456/listaServidor"
                }
              ]}/>  
          </div>
      </nav>
  );
};

export default NavBar;
