import { api } from "../config/axiosConfig";

export const PED_EMIService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrarPED/EMI/', params).catch((erro) => {
      return erro
    })

    return res
  }
}
