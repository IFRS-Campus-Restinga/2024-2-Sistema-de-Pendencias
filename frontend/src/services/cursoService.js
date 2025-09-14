import { api } from "../config/axiosConfig";

export const cursoService = {
  buscarPorModalidade: async (pagina = 1, param = "", categoria, retorno) => {
    return await api.get("hub/cursos/get/", {
      params: {
        pagina,
        categoria,
        retorno,
        busca: param,
      },
    });
  },
};

export default cursoService;
