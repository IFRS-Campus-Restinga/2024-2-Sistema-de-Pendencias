import { Outlet, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { validaUsuario } from "../validaUsuario";
import { useEffect } from "react";
import { verificarGrupos } from "../../../utils/permissões";
import { ToastContainer } from "react-toastify";

const BaseCoordenador = () => {
  const redirect = useNavigate();
  const homeUrl = `/${verificarGrupos(
    JSON.parse(sessionStorage.getItem("user")).group
  )}`;

  const validaProfessor = () => {
    const res = validaUsuario("coord");

    if (!res.status) {
      if (res.grupo === undefined) redirect("/");
      else redirect(`/${res.grupo}`);
    }
  };

  useEffect(() => {
    validaProfessor();
  }, []);

  return (
    <PageContainer homeUrl={homeUrl}>
      <ToastContainer autoClose={2000} position="bottom-right" />
      <Outlet />
    </PageContainer>
  );
};

export default BaseCoordenador;
