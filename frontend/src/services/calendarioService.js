import { api } from "../config/axiosConfig";

export const calendarioService = {
  buscar: async (pagina = 1, param = "") => {
    return await api.get("hub/calendario/get/", {
      params: {
        page: pagina,
        data_format: "search",
        search: param,
        status: "Ativo",
      },
    });
  },
};
