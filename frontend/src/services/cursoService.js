import {api} from '../config/axiosConfig';

  const cursoService = {
    create: async (data) => {
      try {
        const response = await api.post('http://localhost:8000/api/cursos/', data);
        return response.data;
      } catch (error) {
        console.error("Erro ao criar curso:", error);
        throw error;
      }
    }

  };
  
export default cursoService;
