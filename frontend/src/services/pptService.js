import { api } from "../config/axiosConfig";

export const PPTService = {
  criar: async (params) => {
    const res = await api.post('/api/ppt/cadastrar/', params)

    return {
      status: res.status,
      mensagem: res.mensagem
    }
  },
  
  listar: async (retorno, param, pagina) => {
    try {
            const res = await api.get('api/ppt/listar/', {
                params: {
                    retorno,
                    page: pagina,
                    page_size: 10,
                    busca: param
                }
            });

            return res;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao buscar progressões");
            }

            throw new Error("Erro inesperado ao buscar progressões");
        }
    },

  porId: async (pptId, retorno) => {
    const res = await api.get(`api/ppt/detalhes/${pptId}/`, {
      params: {
        retorno
      }
    })

    return {
      status: res.status,
      mensagem: res.mensagem,
      data: res.data
    }  
  },

  editar: async (pptId, params) => {
    const res = await api.patch(`api/ppt/editar/${pptId}/`, params);

    return {
      status: res.status,
      mensagem: res.mensagem
    }
  },

  trocarStatus: async (pptId, params) => {
    const res = await api.patch(`api/ppt/status/${pptId}/`, params)

    return {
      status: res.status,
      mensagem: res.mensagem
    }
  }
}
