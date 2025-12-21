import { api } from "../config/axiosConfig";

export const PEDService = {
  criar: async (params, modalidade) => {
    return await api.post(`api/peds/${modalidade}/cadastrar/`, params);
  },

  listar: async (retorno, param, pagina, modalidade, formato, cursor) => {
    return await api.get(`api/peds/${modalidade}/listar/`, {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        busca: param,
        formato,
        cursor
      },
    });
  },

  listarProfessor: async (retorno, param, pagina, modalidade, formato, cursor) => {
    return await api.get(`api/peds/${modalidade}/listar/professor/`, {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        busca: param,
        formato,
        cursor
      },
    });
  },

  listarCoordenador: async (retorno, param, pagina, modalidade, formato, cursor) => {
    return await api.get(`api/peds/${modalidade}/listar/coordenador/`, {
      params: {
        retorno,
        page: pagina,
        page_size: 10,
        busca: param,
        formato,
        cursor
      },
    });
  },

  listarAluno: async (retorno, pagina, formato, params) => {
    return await api.get(`api/peds/listar/aluno/`, {
      params: {
        retorno,
        page: pagina,
        page_size: 4,
        formato,
        "params[]": params,
      },
    });
  },

  porId: async (pedId, modalidade, retorno, formato) => {
    return await api.get(`api/peds/${modalidade}/${pedId}/`, {
      params: { formato, retorno },
    });
  },

  editar: async (params, pedId, modalidade) => {
    return await api.put(`api/peds/${modalidade}/${pedId}/editar/`, params);
  },

  trocarStatus: async (modalidade, pedId, status) => {
    return await api.put(`api/peds/${modalidade}/${pedId}/editar/status/`, {status: status})
  },

  desativar: async (modalidade, pedId) => {
    return await api.put(`api/peds/desativar/${modalidade}/${pedId}/`);
  },
};
