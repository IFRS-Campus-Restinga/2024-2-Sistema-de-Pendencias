import { api } from "../config/axiosConfig"
import EditarDisciplina from "../pages/base/Gestao/cadastroDisciplina/CadastroDisciplina"

export const disciplinaService = {
  criar: async (params) => {
    try {
      const res = await api.post('api/disciplina/cadastrar/', params)

      return res
    } catch (error) {
        if (error.response?.data?.mensagem) {
          const mensagem = error.response.data.mensagem;

          if (Array.isArray(mensagem)) {
              throw new Error(JSON.stringify(mensagem));
          }

          if (typeof mensagem === 'string') {
              throw new Error(JSON.stringify([mensagem]));
          }
      }

      throw new Error(JSON.stringify(["Erro inesperado ao cadastrar curso."]));
    }
  },

  listar: async () => {
    const res = await api.get('api/disciplina/listar/', {
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
    try {
      const res = await api.put(`api/disciplina/editar/${disciplinaId}/`, params)
      
      return res
    } catch (error) {
      if (error.response?.data?.mensagem) {
        const mensagem = error.response.data.mensagem;
        if (Array.isArray(mensagem)) {
          throw new Error(JSON.stringify(mensagem));
        }
  
        if (typeof mensagem === 'object') {
          throw new Error(JSON.stringify(Object.values(mensagem).flat()));
        }
  
        if (typeof mensagem === 'string') {
          throw new Error(JSON.stringify([mensagem]));
        }
      }
  
      throw new Error(JSON.stringify(["Erro inesperado ao editar curso."]));
    }
  }
}
