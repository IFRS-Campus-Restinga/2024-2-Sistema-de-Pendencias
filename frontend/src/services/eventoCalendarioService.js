import { api } from "../config/axiosConfig";

export const eventoCalendarioService = {
    create: async (params) => {
        try {
            const res = await api.post('api/cadastrar-evento/', params);
            return res;
        } catch (erro) {
            console.error("Erro ao cadastrar evento:", erro);
            throw erro;
        }
    },
    
    listar: async () => {
        try {
            const res = await api.get('api/listar-eventos/');  // Novo endpoint para listar eventos
            return res;
        } catch (erro) {
            console.error("Erro ao listar eventos:", erro);
            throw erro;
        }
    },


    update: async (id, params) => {
        try {
            const res = await api.put(`api/editar-evento/${id}/`, params); // Altere o endpoint conforme necessário
            return res;
        } catch (erro) {
            console.error("Erro ao atualizar evento:", erro);
            throw erro;
        }
    },

    delete: async (id) => {
        try {
            const res = await api.delete(`api/deletar-evento/${id}/`); // Altere o endpoint conforme necessário
            return res;
        } catch (erro) {
            console.error("Erro ao deletar evento:", erro);
            throw erro;
        }
    }

};