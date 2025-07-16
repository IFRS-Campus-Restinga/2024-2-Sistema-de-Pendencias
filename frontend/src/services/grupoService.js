import api from "../config/axiosConfig";

const GrupoService = {
  criar: async (params) => {
    return await api.post("api/grupo/cadastar/", params);
  },

  listar: async (pagina = 1, param = "") => {
    try {
      return await api.get("api/grupo/listar/", {
        params: {
          param,
          pagina,
          data_format: "list",
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  detalhes: async (grupoId) => {
    return await api.get(`api/grupo/${grupoId}/detalhes/`);
  },

  editar: async (grupoId, params) => {
    return api.put(`api/grupo/${grupoId}/editar/`, params);
  },
};

export default GrupoService;
