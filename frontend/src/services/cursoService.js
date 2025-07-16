import { apiHub } from "../config/axiosConfig";

export const cursoService = {
  buscarPorModalidade: async (pagina = 1, param = "", modalidade) => {
    return await apiHub.get(`api/course/get/modality/${modalidade}`, {
      params: {
        page: pagina,
        data_format: "search",
        search: param,
      },
    });
  },
};

export default cursoService;
