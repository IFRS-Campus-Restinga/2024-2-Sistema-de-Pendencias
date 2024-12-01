import { api } from "../config/axiosConfig"
import EditarDisciplina from "../pages/base/Gestao/editarDisciplina/EditarDisciplina"

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

  editar: async (params, disciplinaId) => {
    const res = await api.post(`api/disciplina/editar/${disciplinaId}/`, params).catch((erro) => {
      return erro
    })

    return res
  }
}
