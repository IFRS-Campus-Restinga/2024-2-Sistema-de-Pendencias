import { api } from "../config/axiosConfig";

export const turmaService = {
  create: async (params, csrfToken) => {
    const res = await api
      .post("/cadastrar_turma", params, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      })
      .catch((erro) => {
        if (erro.response && erro.response.status === 400) {
          return erro.response;
        }
      });

    return res;
  },

  list: async (curso) => {
    const res = await api.get(`api/listar_turmas/${curso}`).catch((erro) => {
      console.error("Erro ao listar turmas:", erro);
    });
    return res;
  },

};

