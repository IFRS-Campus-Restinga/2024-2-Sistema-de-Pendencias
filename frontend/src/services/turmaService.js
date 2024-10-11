import { api } from "../config/axiosConfig";

const turmaService = {
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

  list: async () => {
    const res = await api.get("/listar_turmas").catch((erro) => {
      console.error("Erro ao listar turmas:", erro);
    });
    return res;
  },

};

export default turmaService;
