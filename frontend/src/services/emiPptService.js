import { api } from "../config/axiosConfig";

export const PPTService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrar-ppt/', params).catch((erro) => {
      return erro
    })

    return res
  }
}
