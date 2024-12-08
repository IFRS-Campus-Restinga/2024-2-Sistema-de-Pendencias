import { api } from "../config/axiosConfig";

export const PPTService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrar-ppt/', params).catch((erro) => {
      return erro
    })

    return res
  },
  
  list: async (retorno) => {
    const res = await api.get('api/listar-ppt/', {
      params: {
        retorno
      }
    }).catch((erro) => {
        return erro
    })

    return res
  },

  listRegistro: async () => {
    const res = await api.get('api/listar-ppt-registro/', {
      params: {
        incluir_dados: true
      }
    }).catch((erro) => {
        return erro
    })

    return res
  },

  getById: async (id, retorno) => {
    const res = await api.get(`api/listar-ppt/${id}/`, {
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

  desativar: async (id, dados) => {
    try {
      const response = await api.post(`api/desativar-ppt/${id}/`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao desativar PPT:', error);
      throw error;
    }
  },

  em_andamento: async (id, dados) => {
    try {
      const response = await api.post(`api/ppt-em-andamento/${id}/`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do PPT:', error);
      throw error;
    }
  },

  lancado: async (id, dados) => {
    try {
      const response = await api.post(`api/ppt-lancado/${id}/`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do PPT:', error);
      throw error;
    }
  },

}
