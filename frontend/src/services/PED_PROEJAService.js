import { api } from "../config/axiosConfig";

export const PED_PROEJAService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrarPED/ProEJA/', params).catch((erro) => {
      return erro
    })

    return res
  }
}
