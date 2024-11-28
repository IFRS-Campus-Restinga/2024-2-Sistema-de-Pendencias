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
            const response = await api.get(`/api/listar-cursos/`, {
                params: {
                    retorno: 'lista'
                }
            });
            return response;
        } catch (error) {
            console.error('Erro ao listar cursos:', error);
            throw error; // Lança o erro
        }
    },

    // Método para atualizar um curso
    update: async (id, params) => {
        try {
            const res = await api.put(`api/editar-curso/${id}/`, params); // Endpoint de edição de curso
            return res;
        } catch (erro) {
            console.error("Erro ao atualizar curso:", erro);
            throw erro;
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
    },

    // Método para obter um curso pelo ID
    getCursoById: async (id) => {
        try {
            const res = await api.get(`api/cursos/${id}/`); // Endpoint para pegar curso por ID
            return res;
        } catch (erro) {
            console.error("Erro ao buscar curso:", erro);
            throw erro;
        }
    },
};

export default cursoService;
