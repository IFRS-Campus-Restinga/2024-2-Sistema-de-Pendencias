import { api } from '../config/axiosConfig';

const atividadeService = {
    porId: async (id) => {
        const response = await api.get(`api/obter-conselho-de-classe/${id}/`).catch((erro) => {
            return erro
        })
        return response
    },

    criarConselhoDeClasse: async (data) => {
        try {
            const response = await api.post('/api/criar-conselho-de-classe/', data);
            return response;
        } catch (error) {
            console.error('Erro ao criar conselho de classe:', error);
            throw error;
        }
    },

    listarConselhoDeClasse: async (retorno) => {
        try {
            const response = await api.get(`/api/listar-conselho-de-classe/`, {
                params: {
                    retorno
                }
            });
            return response;
        } catch (error) {
            console.error('Erro ao listar conselho de classe:', error);
            throw error;
        }
    },

    editarConselhoDeClasse: async (id, params) => {
        try {
            const res = await api.put(`api/editar-conselho-de-classe/${id}/`, params); // Endpoint de edição de curso
            return res;
        } catch (erro) {
            console.error("Erro ao atualizar conselho de classe:", erro);
            throw erro;
        }
    },

    deletarConselhoDeClasse: async (id) => {
        try {
            const response = await api.delete(`api/deletar-conselho-de-classe/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar conselho de classe:', error);
            throw error;
        }
    },

};

export default atividadeService;

