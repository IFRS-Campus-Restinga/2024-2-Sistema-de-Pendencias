import api from "../config/axiosConfig"


const AcompanhamentoService = {
    criar: async (modalidade, params) => {
        return await api.post(`api/acompanhamentos/${modalidade}/cadastrar/`, params)
    },

    listar: async (modalidade, pedId, pagina) => {
        return await api.get(`api/acompanhamentos/${modalidade}/${pedId}/listar/`, {
            params: {
                page: pagina,
            }
        })
    },

    editar: async (modalidade, acompanhamentoId, params) => {
        return await api.put(`api/acompanhamentos/${modalidade}/${acompanhamentoId}/editar/`, params)
    }
}

export default AcompanhamentoService