import { apiHub } from "../config/axiosConfig";

export const UsuarioService = {
  buscar: async (pagina = 1, param = "", grupo) => {
    return apiHub.get(`api/user/get/group/${grupo}/`, {
      params: {
        data_format: "search",
        search: param,
        page: pagina,
      },
    });
  },
};
