import { api } from "../config/axiosConfig";

export const PEDService = {
  create_EMI: async (params) => {
    const res = await api.post('/api/cadastrarPED-EMI/', params).catch((erro) => {
      return erro
    })

    return res
  },

  create_ProEJA: async (params) => {
    const res = await api.post('api/cadastrarPED-ProEJA/', params).catch((erro) => {
      return erro
    })

    return res
  },

  porId: async (pedId, modalidade, retornar_ids) => {
    const res = await api.get(`api/ped/${pedId}/${modalidade}`, {
      params: {
        retornar_ids
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  listaEMI: async (professorId) => {
    const res = await api.get(`api/ped-emi/?professorId=${professorId ?? ''}`,{
      params: {
        incluir_dados: true
      }
    }
    ).catch((erro) => {
      return erro
    })

    return res
  },

  listaProEJA: async (professorId) => {
    const res = await api.get(`api/ped-proeja/?professorId=${professorId ?? ''}`, {
      params: {
        incluir_dados: true
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  atualizar_EMI: async (params, pedId) => {
    const res = await api.post(`api/atualizar-emi/${pedId}/`, params).catch((erro) => {
      return erro
    })

    return res
  },

  atualizar_ProEJA: async (params, pedId) => {
    const res = await api.post(`api/atualizar-proeja/${pedId}/`, params).catch((erro) => {
      return erro
    })

    return res
  },

  desativar: async (id, dados, modalidade) => {
    try {
      const response = await api.post(`api/desativar-ped/${id}/${modalidade}/`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao desativar PED:', error);
      throw error;
    }
  }
}
