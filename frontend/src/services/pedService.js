import { api } from "../config/axiosConfig";

export const PEDService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrarPED/', params).catch((erro) => {
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

  porId: async (idPED) => {
    const res = await api.get(`api/ped/${idPED}/`).catch((erro) => {
      return erro
    })

    return res
  }
}
