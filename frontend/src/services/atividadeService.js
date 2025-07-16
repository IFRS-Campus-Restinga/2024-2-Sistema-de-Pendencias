import { api } from "../config/axiosConfig";

const atividadeService = {
  criar: async (modalidade, params) => {
    const res = await api
      .post(`/api/atividade/cadastro/${modalidade}/`, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  vincular: async (pedId, modalidade, params) => {
    const res = await api
      .post(`/api/atividade/vincular/${pedId}/${modalidade}/`, params)
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  porId: async (atividadeId, modalidade) => {
    const res = await api
      .get(`/api/plano-atividades/detalhes/${modalidade}/${atividadeId}/`, {
        params: {
          retorno: "detalhes",
        },
      })
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  porAvaliacao: async (avaliacaoId, modalidade) => {
    const res = await api
      .get(`/api/plano-atividades/avaliacao/${modalidade}/${avaliacaoId}/`, {
        params: {
          retorno: "detalhes",
        },
      })
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  listarPorPED: async (pedId, modalidade) => {
    const res = await api
      .get(`/api/plano-atividades/${pedId}/${modalidade}/`, {
        params: {
          retorno: "listar",
        },
      })
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  listarPorProfessor: async (modalidade) => {
    const res = await api
      .get(
        `/api/plano-atividades/professor/listar/?modalidade=${
          modalidade ?? ""
        }`,
        {
          params: {
            retorno: "listar",
          },
        }
      )
      .catch((erro) => {
        return erro;
      });

    return res;
  },

  editar: async (atividadeId, modalidade, params) => {
    try {
      const response = await api.put(
        `api/plano-atividades/editar/${modalidade}/${atividadeId}/`,
        params,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao editar a atividade:", error);
      throw error;
    }
  },
};

export default atividadeService;
