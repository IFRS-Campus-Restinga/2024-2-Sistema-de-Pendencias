import api from "../config/axiosConfig";

const AvaliacaoService = {
    vincular: async (pedId, modalidade, params) => {
        const res = await api.post(`api/plano-atividades/${modalidade}/salvar/${pedId}/`, params)
        
        return res;
    },

    listar: async (pedId, modalidade, retorno) => {
        const res = await api.get(`api/plano-atividades/${modalidade}/${pedId}/`, {
            params: {
                retorno,
            },
        })

        return res;
    },
}

export default AvaliacaoService