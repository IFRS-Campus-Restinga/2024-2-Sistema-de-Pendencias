import { api } from "../config/axiosConfig";

export const disciplinaService = {
  buscarPorCurso: async (cursoId, pagina = 1, param = "", retorno) => {
    return await api.get(`hub/cursos/get/${cursoId}/curriculo/`, {
      params: {
        pagina,
        retorno,
        busca: param,
      },
    });
  },
};
