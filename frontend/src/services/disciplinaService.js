import { api } from "../config/axiosConfig";

export const disciplinaService = {
  buscarPorCurso: async (cursoId, pagina = 1, param = "") => {
    return await api.get(`hub/curso/${cursoId}/disciplinas/`, {
      params: {
        page: pagina,
        data_format: "search",
        search: param,
      },
    });
  },
};
