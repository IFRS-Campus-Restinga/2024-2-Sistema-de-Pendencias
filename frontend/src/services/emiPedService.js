import { api } from "../config/axiosConfig";

export const emiPedService = {
  create: async (params) => {
    const res = await api.post('/api/cadastrar/em-ped', params).catch((erro) => {
      return erro
    })

    return res
  }
}
