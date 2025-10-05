import { api } from "../config/axiosConfig";

export const PPTService = {
  criar: async (params) => {
    return await api.post("/api/ppts/cadastrar/", params);
  },

  listar: async (retorno, param, pagina, formato) => {
    return await api.get("api/ppts/listar/", {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        busca: param,
        formato,
      },
    });
  },

  porId: async (pptId, retorno, formato) => {
    return await api.get(`api/ppts/${pptId}/`, {
      params: {
        retorno,
        formato,
      },
    });
  },

  desativar: async (pptId, params) => {
    return await api.patch(`api/ppt/${pptId}/desativar`, params);
  },
};
