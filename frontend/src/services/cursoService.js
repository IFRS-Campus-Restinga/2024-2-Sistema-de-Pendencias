import {api} from '../config/axiosConfig';

export const cursoService = {
    create: async (data) => {
      try {
        const response = await api.post('/api/cadastrar-curso/', data);
        return response.data;
      } catch (error) {
        console.error("Erro ao criar curso:", error);
        throw error;
      }
    },

    list: async (data) => {
      const res = api.get('api/listar-cursos/', data).catch((erro) => {
        return erro
      })

      return res
    }

  };