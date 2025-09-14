import { Outlet, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { validaUsuario } from "../validaUsuario";
import { useEffect } from "react";
import { verificarGrupos } from "../../../utils/permissões";
import { ToastContainer } from "react-toastify";

const BaseGestao = () => {
  const redirect = useNavigate()
  const homeUrl = `/${verificarGrupos(JSON.parse(sessionStorage.getItem('user')).group)}`

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
      <ToastContainer autoClose={2000} position="bottom-right" />
      <Outlet />
    </PageContainer>
  );
};

export default BaseGestao;
