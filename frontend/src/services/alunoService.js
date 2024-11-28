import { api } from "../config/axiosConfig"

export const alunoService = {
    create: async (params) => {
        try {
            const res = await api.post('api/cadastrar-aluno/', params);
            return res; // Retorna os dados da resposta
        } catch (erro) {
            console.error("Erro ao cadastrar aluno:", erro); // Log do erro para depuração
            throw erro; // Opcional: relança o erro para ser tratado onde a função for chamada
        }
    },

    addInfos: async (params) => {
        const res = await api.post('api/dados-adicionais-aluno/', params).catch((erro) => {
            return erro
        })

        return res
    },

    listar: async () => {
        try {
            const res = await api.get('api/listar-alunos/');
            return res;
        } catch (erro) {
            console.error("Erro ao listar alunos:", erro);
            throw erro;
        }
    },

    listarPedsAluno: async () => {
        try {
            const token = localStorage.getItem("token"); // Obtém o token armazenado
            const headers = { Authorization: `Bearer ${token}` }; // Configura o cabeçalho com o token
            const res = await api.get('api/aluno/peds/', { headers }); // Corrigido o caminho
            return res;
        } catch (erro) {
            console.error("Erro ao listar PEDS do aluno:", erro);
            throw erro;
        }
    },

};