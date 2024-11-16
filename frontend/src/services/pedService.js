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

  listarPorProfessor: async (professor) => {
    const res = await api.get(`api/listar-ped/${professor}/`).catch((erro) => {
      return erro
    }) 

    return res
  },

  porId: async (pedId) => {
    const res = await api.get(`api/ped/${pedId}/`, {
      params: {
        retornar_ids: true
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  listaEMI: async (professorId) => {
    const res = await api.get(`api/ped-emi/?professorId=${professorId}`).catch((erro) => {
      return erro
    })

    return res
  },

  listaProEJA: async (professorId) => {
    const res = await api.get(`api/ped-proeja/?professorId=${professorId}`).catch((erro) => {
      return erro
    })

    return res
  }
}
