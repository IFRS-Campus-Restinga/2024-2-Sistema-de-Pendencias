import { api } from "../config/axiosConfig";

export const PEDService = {
  create_EMI: async (params) => {
    const res = await api.post('/api/cadastrarPED-EMI/', params).catch((erro) => {
      return erro
    })

    return res
  },

  create_ProEJA: async (params) => {
    const res = await api.post('api/cadastrarPED-ProEJA/', params).catch((erro) => {
      return erro
    })

    return res
  },

  porId: async (pedId, modalidade, retorno) => {
    try {
      const response = await api.get(`api/ped/${pedId}/${modalidade}`, {
        params: { retorno },
      });
      console.log("Dados da PED recebidos:", response.data);
      return response;
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error);
      throw error;
    }
  },

  listaEMI: async (professorId, retorno) => {
    const res = await api.get(`api/ped-emi/?professorId=${professorId ?? ''}`,{
      params: {
        retorno
      }
    }
    ).catch((erro) => {
      return erro
    })

    return res
  },

  listaProEJA: async (professorId, retorno) => {
    const res = await api.get(`api/ped-proeja/?professorId=${professorId ?? ''}`, {
      params: {
        retorno
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  atualizar_EMI: async (params, pedId) => {
    const res = await api.post(`api/atualizar-emi/${pedId}/`, params).catch((erro) => {
      return erro
    })

    return res
  },

  atualizar_ProEJA: async (params, pedId) => {
    const res = await api.post(`api/atualizar-proeja/${pedId}/`, params).catch((erro) => {
      return erro
    })

    return res
  },

  desativar: async (id, dados, modalidade) => {
    try {
      const response = await api.post(`api/desativar-ped/${id}/${modalidade}/`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao desativar PED:', error);
      throw error;
    }
  },

  detalhesPorIdAluno: async (pedId, modalidade) => {
  const res = await api.get(`/api/aluno/ped/${pedId}/${modalidade}/`).catch((erro) => {
    return erro;
  });

  return res;
},

  detalhesPPTAluno: async (pptId) => {
  const res = await api.get(`/api/aluno/ppt/${pptId}/`).catch((erro) => {
    return erro;
  });

  return res;
},

encerrar_ped: async (params) => {
  const { ped_tipo, ped_id } = params;
  const res = await api.put(`/api/encerrar-ped/${ped_tipo}/${ped_id}/`).catch((erro) => {
    return erro;
  });

  return res;
},


}
