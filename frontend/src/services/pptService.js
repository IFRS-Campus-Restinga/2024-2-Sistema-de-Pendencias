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

  listarPendentes: async (retorno, pagina, formato) => {
    return await api.get("api/ppts/listar/pendentes/", {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        formato,
      },
    });
  },

  listarCoordenador: async (retorno, pagina, formato, param) => {
    return await api.get("api/ppts/listar/coordenador/", {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        formato,
        busca: param
      },
    });
  },

  listarCRE: async (retorno, pagina, formato) => {
    return await api.get("api/ppts/listar/CRE/", {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        formato,
      },
    });
  },

  listarAluno: async (retorno, pagina, formato, params) => {
    return await api.get("api/ppts/listar/aluno/", {
      params: {
        retorno,
        page: pagina,
        page_size: 4,
        formato,
        "params[]": params,
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

  trocarStatus: async (pptId, params) => {
    return await api.put(`api/ppts/${pptId}/editar/status/`, params);
  },
};
