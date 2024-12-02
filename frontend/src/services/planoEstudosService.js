import { api } from "../config/axiosConfig";

export const PlanoEstudosService = {
  create: async (formData) => {
    const { pedId } = formData; // Extrai pedId do formData
    return api.post(`/api/cadastrar-plano-estudos/${pedId}/`, formData); // Inclui pedId na URL
  },
 

  buscarPlanoEstudo: async (pedId) => {
    try {
      const response = await api.get(`api/detalhes-plano-estudos/${pedId}/`);  // A URL está correta
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes do plano de estudos:", error);
      throw error;
    }
  },
  
  update: async (pedId, formData) => {
    try {
      const response = await api.put(`/api/atualizar-plano-estudos/${pedId}/`, formData);
      return response; // Retorne o objeto completo
    } catch (error) {
      console.error("Erro ao atualizar plano de estudos:", error);
      throw error;
    }
  },
};


