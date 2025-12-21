import { api } from "../config/axiosConfig";

const AtividadeService = {
  criar: async (modalidade, params) => {
    const res = await api.post(`api/atividades/${modalidade}/cadastrar/`, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

    return res;
  },

  listar: async (modalidade, pagina, param, retorno, _) => {
    const res = await api.get(`api/atividades/${modalidade}/`,
      {
        params: {
          pagina,
          busca: param,
          retorno,
        },
      })

    return res;
  },

  porId: async (atividadeId, modalidade, retorno) => {
    const res = await api
      .get(`api/atividades/${modalidade}/${atividadeId}/`, {
        params: {
          retorno,
        },
      })

    return res;
  },

  editar: async (atividadeId, modalidade, params) => {
    const res = await api.put(`api/atividades/${modalidade}/${atividadeId}/editar/`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }
}

export default AtividadeService;
