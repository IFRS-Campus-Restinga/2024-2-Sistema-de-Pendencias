import { api } from "../config/axiosConfig"

export const alunoService = {
    create: async (params) => {
        try {
            const res = await api.post('api/cadastrar-aluno/', params);
            return res.data; // Retorna os dados da resposta
        } catch (erro) {
            console.error("Erro ao cadastrar aluno:", erro); // Log do erro para depuração
            throw erro; // Opcional: relança o erro para ser tratado onde a função for chamada
        }
    }
};