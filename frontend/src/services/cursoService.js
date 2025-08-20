import { api } from "../config/axiosConfig";

export const cursoService = {
  buscarPorModalidade: async (pagina = 1, param = "", modalidade) => {
    return await api.get("hub/cursos/get/", {
      params: {
        page: pagina,
        modality: modalidade,
        data_format: "search",
        search: param,
      },
    });
  },
};

export default cursoService;
