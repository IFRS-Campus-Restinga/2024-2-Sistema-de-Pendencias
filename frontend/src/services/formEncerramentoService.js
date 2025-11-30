import { api } from "../config/axiosConfig";

export const FormEncerramentoService = {
  criar: async (pedId, modalidade, params) => {
    return await api.post(
      `/api/form-encerramento/${modalidade}/cadastrar/${pedId}/`,
      params
    );
  },

  buscar: async (formEncerramentoId, modalidade, retorno) => {
    return await api.get(`/api/form-encerramento/${modalidade}/${formEncerramentoId}/`, {
      params: {
        retorno,
      },
    });
  },

  editar: async (formEncerramentoId, modalidade, params) => {
    return await api.put(
      `/api/form-encerramento/${modalidade}/${formEncerramentoId}/editar/`,
      params
    );
  },
};
