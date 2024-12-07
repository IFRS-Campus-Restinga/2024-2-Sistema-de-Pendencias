import { api } from '../config/axiosConfig';

export const observacaoService = {
  adicionarObservacao: async (formData) => {
    return api.post(`/api/adicionar-observacao/`, formData);
  },

  list: async () => {
    try {
      const response = await api.get('/api/listar-observacoes/');
      return response;
    } catch (error) {
      console.error('Erro ao listar observações:', error);
      throw error;
    }
  },

  
  visualizar: async (idObservacao) => {
    try {
        const res = await api.get(`/api/visualizar-observacao/${idObservacao}/`);
        return res.data;
    } catch (erro) {
        console.error(`Erro ao buscar observação com ID ${idObservacao}:`, erro);
        throw erro;
    }
},

};

