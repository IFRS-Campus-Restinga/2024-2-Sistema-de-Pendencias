import { api } from "../config/axiosConfig";

const testeService = {
  create: async (params, csrfToken) => {
    const res = await api
      .post("/teste", params, {
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

export default testeService;
