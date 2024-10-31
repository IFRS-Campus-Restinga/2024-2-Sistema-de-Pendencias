import { api } from '../config/axiosConfig';

export const cursoService = {
    create: async (data) => {
        try {
            const response = await api.post('/api/cadastrar-curso/', data);
            return response;
        } catch (error) {
            console.error('Erro ao criar curso:', error);
            throw error; // Lança o erro para que o chamador possa lidar com ele
        }
    },

    list: async (filters) => {
        try {
            // Converte os filtros em parâmetros de consulta
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/api/listar-cursos/?${params}`);
            return response;
        } catch (error) {
            console.error('Erro ao listar cursos:', error);
            throw error; // Lança o erro
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/api/deletar-curso/${id}/`);
            return response;
        } catch (error) {
            console.error('Erro ao deletar curso:', error);
            throw error; // Lança o erro
        }
    }
};

export default cursoService;
