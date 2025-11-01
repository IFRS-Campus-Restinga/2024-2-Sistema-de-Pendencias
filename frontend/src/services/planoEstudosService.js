import { api } from "../config/axiosConfig";

export const PlanoEstudosService = {
  criar: async (params, modalidade) => {
    return await api.post(
      `/api/plano-estudos/${modalidade}/cadastrar/`,
      params
    );
  },

  buscar: async (planoId, retorno, modalidade) => {
    return await api.get(`/api/plano-estudos/${modalidade}/${planoId}/`, {
      params: {
        retorno,
      },
    });
  },

  editar: async (planoId, modalidade, params) => {
    return await api.put(
      `/api/plano-estudos/${modalidade}/${planoId}/editar/`,
      params
    );
  },
};
