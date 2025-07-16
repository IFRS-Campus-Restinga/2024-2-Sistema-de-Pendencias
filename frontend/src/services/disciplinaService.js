import { api, apiHub } from "../config/axiosConfig";

export const disciplinaService = {
  buscarPorCurso: async (cursoId, pagina = 1, param = "") => {
    return await apiHub.get(`api/course/get/${cursoId}/school-subject/`, {
      params: {
        page: pagina,
        data_format: "search",
        search: param,
      },
    });
  },
};
