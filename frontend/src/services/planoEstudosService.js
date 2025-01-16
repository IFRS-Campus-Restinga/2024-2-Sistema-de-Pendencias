import { api } from "../config/axiosConfig";

export const PlanoEstudosService = {
  criar: async (formData, modalidade) => {
    const res = api.post(`/api/plano-estudos/cadastrar/${modalidade}/`, formData).catch((error) => {
      return error
    });

    return res
  },
 

  buscar: async (planoId, retorno, modalidade) => {
      const res = await api.get(`/api/plano-estudos/detalhes/${planoId}/${modalidade}/`, {
        params: {
          retorno
        }
      }
    ).catch((error) => {
      return error
    })

    return res
  },
  
  editar: async (planoId, modalidade, params) => {
    const res = await api.put(`/api/plano-estudos/editar/${planoId}/${modalidade}/`, params).catch((error) => {
      return error
    })

    return res
  },
};


