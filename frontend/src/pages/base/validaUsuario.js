import { jwtDecode } from "jwt-decode";
import { verificarGrupos } from "../../utils/permissões";

export const validaUsuario = (grupoPagina) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const grupo = verificarGrupos(user.groups);

  if (grupo !== grupoPagina) {
    return {
      status: false,
      grupo: grupo,
    };
  } else {
    return {
      status: true,
    };
  }
};
