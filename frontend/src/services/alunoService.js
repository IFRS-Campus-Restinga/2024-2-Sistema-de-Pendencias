import { api } from "../config/axiosConfig"

export const alunoService = {
    addInfos: async (params) => {
        const res = await api.post('api/dados-adicionais-aluno/', params).catch((erro) => {
            return erro
        })

        return res
    },

    listarDependenciasAluno: async () => {
        try {
            const res = await api.get('api/aluno/dependencias/', {
                params: {
                    retorno: 'aluno'
                }
            });
            
            return res;
        } catch (erro) {
            console.error("Erro ao listar PEDS do aluno:", erro);
            throw erro;
        }
    },
};