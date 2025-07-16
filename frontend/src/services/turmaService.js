import { apiHub } from "../config/axiosConfig";

export const turmaService = {
  buscarPorCurso: async (cursoId, pagina = 1, param = "") => {
    return apiHub.get(`api/course/get/${cursoId}/class/`, {
      params: {
        page: pagina,
        search: param,
        data_format: "search",
      },
    });
  },
};
