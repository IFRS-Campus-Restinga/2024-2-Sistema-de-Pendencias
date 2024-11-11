import { api } from "../config/axiosConfig";

export const PPTService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrar-ppt/', params).catch((erro) => {
      return erro
    })

    return res
  },
  
  list: async () => {
    const res = await api.get('api/listar-ppt/').catch((erro) => {
        return erro
    })

    return res
  },

  getById: async (id) => {
    const res = await api.get('api/listar-ppt/'+id+'/').catch((erro) => {
      return erro
    })

    return res
  },

  editar: async (id, dadosAtualizados) => {
    try {
        const response = await api.put(`api/editar-ppt/${id}/`, dadosAtualizados); 
        return response.data;
    } catch (error) {
        console.error('Erro ao editar PPT:', error);
        throw error; 
    }
  },

}
