import { api } from "../config/axiosConfig";

export const PEDService = {
  criar: async (params, modalidade) => {
    try {
          const res = await api.post(`api/ped/${modalidade}/cadastrar/`, params)

          return res;
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
    
            throw new Error(JSON.stringify(["Erro inesperado ao cadastrar PED."]));
        }
  },
  
  listar: async (retorno, param, pagina, modalidade) => {
    try {
            const res = await api.get(`api/ped/${modalidade}/listar/`, {
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

  porId: async (pedId, modalidade, retorno) => {
      const res = await api.get(`api/ped/${modalidade}/detalhes/${pedId}/`, {
        params: { retorno },
      });

      return {
        status: res.status,
        mensagem: res.mensagem,
        data: res.data
      }
  },
  
  editar: async (params, pedId, modalidade) => {
    try {
      const res = await api.patch(`api/ped/${modalidade}/editar/${pedId}/`, params)
      
      return res;
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

        throw new Error(JSON.stringify(["Erro inesperado ao cadastrar PED."]));
    }
  },

  desativar: async (modalidade, pedId) => {
    try {
      const res = await api.put(`api/ped/desativar/${modalidade}/${pedId}/`);
      
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
