import { api } from "../config/axiosConfig"

export const eventoCalendarioService = {
    create: async (params) => {
        try {
            const res = await api.post('api/cadastrar-evento/', params);
            return res; // Retorna os dados da resposta
        } catch (erro) {
            console.error("Erro ao cadastrar evento:", erro); // Log do erro para depuração
            throw erro; // Opcional: relança o erro para ser tratado onde a função for chamada
        }
    }
};