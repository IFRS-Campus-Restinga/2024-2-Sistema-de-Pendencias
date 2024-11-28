import { api } from "../config/axiosConfig"

export const disciplinaService = {
  create: async (params) => {
    const res = await api.post('api/cadastrar-disciplina/', params).catch((erro) => {
      return erro
    })

    return res
  },

  list: async () => {
    const res = await api.get('api/listar-disciplinas/', {
      params: {
        retorno: 'lista'
      }
    }).catch((erro) => {
      return erro
    }) 

    return res
  },

  porId: async (disciplinaId) => {
    const res = await api.get(`api/disciplina/${disciplinaId}/`).catch((erro) => {
      return erro
    })

    return res
  },

  vincular: async (disciplinaId, cursoId) => {
    const res = await api.post(`api/disciplina/vincular/${disciplinaId}/${cursoId}/`).catch((erro) => {
      return erro
    })

    return res
  },

  desvincular: async (disciplinaId, cursoId) => {
    const res = await api.post(`api/disciplina/desvincular/${disciplinaId}/${cursoId}/`).catch((erro) => {
      return erro
    })

    return res
  }
}
