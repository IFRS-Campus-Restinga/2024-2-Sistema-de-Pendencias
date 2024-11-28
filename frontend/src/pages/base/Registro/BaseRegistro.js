import { Link, Outlet, useNavigate } from "react-router-dom";
import "./BaseRegistro.css";
import { validaUsuario } from "../validaUsuario";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faHouse } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../../components/Dropdown/Dropdown";

const BaseRegistro = () => {
  const redirect = useNavigate();
  const homeUrl = `/sessao/${
    jwtDecode(sessionStorage.getItem("token")).grupo
  }/${jwtDecode(sessionStorage.getItem("token")).idUsuario}`;

  const validaRegistro = () => {
    const res = validaUsuario("RegistroEscolar");

    if (!res.status) {
      if (res.grupo === undefined) redirect("/");
      else redirect(`/sessao/${res.grupo}/${res.idUsuario}`);
    }
  };

  useEffect(() => {
    validaRegistro();
  }, []);

  return (
    <>
      <PageContainer homeUrl={homeUrl}>
        <nav className="navBarProfessor">
          <div className="itemContainer">
            <div className="navItemContainer">
              <Link to={homeUrl}>
                <FontAwesomeIcon icon={faHouse} color="black" size="xl" />
                <span className="navTexto">Início</span>
              </Link>
            </div>
            <div className="navItemContainer">
              <Dropdown
                icone={
                  <FontAwesomeIcon icon={faBook} color="black" size="xl" />
                }
                titulo={"Dependencias"}
                itens={[
                  {
                    name: "Gerenciar PPT",
                    link: `${homeUrl}/listarPPTregistro`,
                  },
                ]}
              />
            </div>
          </div>
        </nav>
        <Outlet />
      </PageContainer>
    </>
  );
};

export default BaseRegistro;
