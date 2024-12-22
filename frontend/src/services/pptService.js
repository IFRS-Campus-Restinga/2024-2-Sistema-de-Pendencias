import { api } from "../config/axiosConfig";

export const PPTService = {
  criar: async (params) => {
    const res = await api.post('/api/cadastrar-ppt/', params).catch((erro) => {
      return erro
    })

    return res
  },
  
  listar: async (retorno) => {
    const res = await api.get('api/listar-ppt/', {
      params: {
        retorno
      }
    }).catch((erro) => {
        return erro
    })

    return res
  },

  porId: async (pptId, retorno) => {
    const res = await api.get(`api/ppt/${pptId}/`, {
      params: {
        retorno
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  editar: async (id, dadosAtualizados) => {
    try {
        const response = await api.put(`api/editar-ppt/${id}/`, dadosAtualizados); 
        return response;
    } catch (error) {
        console.error('Erro ao editar PPT:', error);
        throw error; 
    }
  },

  trocarStatus: async (pptId, status) => {
    const res = await api.get(`api/ppt/${pptId}/trocar-status/`, status).catch((erro) => {
      return erro
    })
  }
}
