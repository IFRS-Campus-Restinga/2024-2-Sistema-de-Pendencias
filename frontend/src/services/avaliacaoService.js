import api from "../config/axiosConfig";

const AvaliacaoService = {
    vincular: async (pedId, modalidade, params) => {
        const res = await api.post(`api/avaliacoes/${modalidade}/vincular/${pedId}`, params)
        
        return res;
    },

    listar: async (pedId, modalidade, retorno) => {
        const res = await api.get(`api/avaliacoes/${modalidade}/${pedId}/`, {
            params: {
                retorno,
            },
        })

        return res;
    },
}

export default AvaliacaoService