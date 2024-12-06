import { api } from '../config/axiosConfig';

export const observacaoService = {
  adicionarObservacao: async (pedId, formData) => {
    return api.post(`/api/adicionar-observacao/${pedId}/`, formData);
  },

  list: async () => {
    try {
      const response = await api.get('/api/listar-observacoes/');
      return response;
    } catch (error) {
      console.error('Erro ao listar observações:', error);
      throw error;
    }
  }
};

