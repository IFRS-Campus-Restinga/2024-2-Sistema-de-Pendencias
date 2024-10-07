import { Link } from "react-router-dom";
import "./menuGestao.css";

const MenuGestao = () => {
  return (
    <section className="homeGestao">
      <nav className="navBarGestao">
        <div className="navItemContainer">
          <Link to={"/secao/123456"}>
            <img
              className="itemImage"
              src="/navBarImages/inicio.png"
              alt="Início"
            />
            <span className="navTexto">Início</span>
          </Link>
        </div>
        <div className="navItemContainer">
          <Link to={"/secao/123456/dependencias"}>
            <img
              className="itemImage"
              src="/navBarImages/dependencias.png"
              alt="Dependências"
            />
            <span className="navTexto">Dependências</span>
          </Link>
        </div>
        <div className="navItemContainer">
          <Link to={"/secao/123456/calendario"}>
            <img
              className="itemImage"
              src="/navBarImages/calendario.png"
              alt="Calendário"
            />
            <span className="navTexto">Calendário</span>
          </Link>
        </div>
        <div className="navItemContainer">
          <Link to={"/secao/123456/cadastros"}>
            <img
              className="itemImage"
              src="/navBarImages/gerenciar_cadastros.png"
              alt="Cadastros"
            />
            <span className="navTexto">Gerenciar Cadastros</span>
          </Link>
        </div>
      </nav>
      <span className="titulo">Sistema de Pendências</span>
      <hr />
      <section className="menuContainer">
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/pessoa.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">PED-EMI</span>
          </div>
        </Link>
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/grupo_pessoas.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">PPT-EMI</span>
          </div>
        </Link>
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/pessoa.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">PED-EJA</span>
          </div>
        </Link>
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/pessoa.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">SERVIDORES</span>
          </div>
        </Link>
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/curso.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">CURSO</span>
          </div>
        </Link>
        <Link to={"/secao/123456/ped_emi"}>
          <div className="menuItem">
            <p className="menuTexto">Ir para lista de:</p>
            <img
              src="/imagensMenu/disciplina.png"
              alt="PED-EMI"
              className="menuImagem"
            />
            <span className="menuTexto">DISCIPLINA</span>
          </div>
        </Link>
      </section>
    </section>
  );
};

export default MenuGestao;
