import api from "../config/axiosConfig";

const GrupoService = {
  criar: async (params) => {
    return await api.post("api/grupos/cadastrar/", params);
  },

  listar: async (pagina = 1, param = "") => {
    try {
      return await api.get("api/grupos/listar/", {
        params: {
          param,
          pagina,
          retorno: "id, name",
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  detalhes: async (grupoId) => {
    return await api.get(`api/grupos/${grupoId}/`, {
      params: {
        retorno: "id, name",
      },
    });
  },

  editar: async (params, grupoId) => {
    return api.put(`api/grupos/${grupoId}/editar/`, params);
  },
};

export default GrupoService;
