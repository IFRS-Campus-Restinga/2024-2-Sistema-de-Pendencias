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

    list: async () => {
        try {
            const response = await api.get(`/api/listar-cursos/`);
            return response;
        } catch (error) {
            console.error('Erro ao listar cursos:', error);
            throw error; // Lança o erro
        }
    },

    porModalidade: async (modalidade) => {
        const res = await api.get(`api/listar-cursos/${modalidade}`).catch((erro) => {
            return erro
        })

        return res
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
