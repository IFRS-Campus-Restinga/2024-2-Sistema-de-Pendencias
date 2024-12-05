import { api } from '../config/axiosConfig';

export const observacaoService = {
  adicionarObservacao: async (pedId, formData) => {
    return api.post(`/api/adicionar-observacao/${pedId}/`, formData);
  },
};
