import { api } from "../config/axiosConfig"

export const disciplinaService = {
  create: async (params) => {
    const res = await api.post('api/cadastrar-disciplina/', params).catch((erro) => {
      return erro
    })

    return res
  },

  list: async () => {
    const res = await api.get('api/listar-disciplinas/').catch((erro) => {
      return erro
    }) 

    return res
  },
}
