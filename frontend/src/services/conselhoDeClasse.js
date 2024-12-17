import { api } from "../config/axiosConfig";

export const conselhoDeClasseService = {
  create: async (params) => {
    try {
      const res = await api.post(
        "/api/cadastrar-conselho-de-classe/",
        params
      );
      return res;
    } catch (error) {
      console.error("Erro ao cadastrar conselho de classe:", error);
      throw error;
    }
  },

  listarConselhoDeClasse: async () => {
    try {
      const res = await api.get("/api/listar-conselho-de-classe/");
      return res;
    } catch (error) {
      console.error("Erro ao listar o conselho de classe:", error);
      throw error;
    }
  },

  editarConselhoDeClasse: async (idConselho, params) => {
    try {
      const res = await api.put(
        `/api/editar-conselho-de-classe//${idConselho}/`, params
      );
      return res;
    } catch (error) {
      console.error("Erro ao editar conselho de classe:", error);
      throw error;
    }
  },

  deletarConselhoDeClasse: async (idConselho) => {
    try {
      const res = await api.put(
        `api/deletar-conselho-de-classe/${idConselho}/`
      );
      return res;
    } catch (error) {
      console.error("Erro ao deletar conselho de classe:", error);
      throw error;
    }
  },
};
