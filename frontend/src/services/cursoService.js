import { api } from "../config/axiosConfig";

const cursoService = {
  create: async (params, csrfToken) => {
    const res = await api
      .post("/cadastrar_curso", params, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      })
      .catch((erro) => {
        if (erro.response.status === 400) return erro.response;
      });

    return res;
  },
};

export default cursoService;
