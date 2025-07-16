import { Outlet, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { validaUsuario } from "../validaUsuario";
import { useEffect } from "react";
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
      <Outlet />
    </PageContainer>
  );
};

export default BaseGestao;
