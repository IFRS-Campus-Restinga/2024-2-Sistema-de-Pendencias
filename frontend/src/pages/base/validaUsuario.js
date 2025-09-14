import { verificarGrupos } from "../../utils/permissões";

export const validaUsuario = (grupoPagina) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const grupo = verificarGrupos(user.group);

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
