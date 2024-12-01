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

  // No seu service
update: async (pedId, formData) => {
  try {
      const response = await api.put(`/api/atualizar-plano-estudos/${pedId}/`, formData); 
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar plano de estudos:", error);
      throw error;
  }
}
};



// import { api } from "../config/axiosConfig";

// export const PlanoEstudosService = {
//   // Função para criar um novo Plano de Estudos Dirigidos
//   create: async (params) => {
//     try {
//       const res = await api.post('/api/cadastrar-plano-estudos/', params);
//       return res;
//     } catch (erro) {
//       // Caso ocorra algum erro na requisição, retorna o erro
//       return erro.response || erro;
//     }
//   },

//   // Função para listar todos os Planos de Estudos Dirigidos
//   list: async () => {
//     try {
//       const res = await api.get('/api/listar-plano-estudos/');
//       return res;
//     } catch (erro) {
//       // Caso ocorra algum erro na requisição, retorna o erro
//       return erro.response || erro;
//     }
//   },

//   // Função para editar ou atualizar um Plano de Estudos
//   update: async (id, params) => {
//     try {
//       const res = await api.put(`/api/atualizar-plano-estudos/${id}/`, params);
//       return res;
//     } catch (erro) {
//       // Caso ocorra algum erro na requisição, retorna o erro
//       return erro.response || erro;
//     }
//   },

//   // Função para excluir um Plano de Estudos
//   delete: async (id) => {
//     try {
//       const res = await api.delete(`/api/excluir-plano-estudos/${id}/`);
//       return res;
//     } catch (erro) {
//       // Caso ocorra algum erro na requisição, retorna o erro
//       return erro.response || erro;
//     }
//   }
// };
