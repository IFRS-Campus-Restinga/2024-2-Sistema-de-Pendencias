import { api } from "../config/axiosConfig";

export const PEDService = {
  criar: async (params, modalidade) => {
    const res = await api.post(`api/ped/${modalidade}/cadastrar/`, params)

    return {
      status: res.status,
      mensagem: res.mensagem
    }
  },

  listar: async (professorId, retorno, modalidade) => {
    const res = await api.get(`api/ped/${modalidade}/listar/${professorId ?? ''}`,{
      params: {
        retorno
      }
    }
    )

    return {
      status: res.status,
      mensagem: res.mensagem,
      data: res.data
    }
  },

  porId: async (pedId, modalidade, retorno) => {
      const res = await api.get(`api/ped/${modalidade}/detalhes/${pedId}/`, {
        params: { retorno },
      });

      return {
        status: res.status,
        mensagem: res.mensagem,
        data: res.data
      }
  },

  editar: async (params, pedId, modalidade) => {
    const res = await api.patch(`api/ped/${modalidade}/editar/${pedId}/`, params).catch((erro) => {
      return erro
    })

    return {
      status: res.status,
      mensagem: res.mensagem
    }
  },

  desativar: async (pedId, params, modalidade) => {
    const res = await api.post(`api/ped/${modalidade}/desativar/${pedId}/`, params);
      
    return {
      status: res.status,
      mensagem: res.mensagem
    }
  }
}
