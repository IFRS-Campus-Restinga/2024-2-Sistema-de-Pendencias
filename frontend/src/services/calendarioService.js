import { api } from "../config/axiosConfig";

export const calendarioService = {
  buscar: async (pagina = 1, param = "", retorno) => {
    return await api.get("hub/calendarios/get/", {
      params: {
        pagina,
        retorno,
        busca: param,
        status: "Ativo",
      },
    });
  },
};
