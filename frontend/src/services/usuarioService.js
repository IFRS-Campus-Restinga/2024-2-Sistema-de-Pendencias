import { api } from "../config/axiosConfig";

export const UsuarioService = {
  buscar: async (pagina = 1, param = "", grupo) => {
    return api.get(`hub/usuarios/get/grupo/${grupo}/`, {
      params: {
        data_format: "search",
        search: param,
        active: true,
        page: pagina,
      },
    });
  },
};
