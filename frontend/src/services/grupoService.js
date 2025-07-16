import api from "../config/axiosConfig";

const GrupoService = {
  criar: async (params) => {
    return await api.post("api/grupo/cadastrar/", params);
  },

  listar: async (pagina = 1, param = "") => {
    try {
      return await api.get("api/grupo/listar/", {
        params: {
          param,
          pagina,
          retorno: "lista",
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  detalhes: async (grupoId) => {
    return await api.get(`api/grupo/${grupoId}/detalhes/`, {
      params: {
        retorno: "detalhes",
      },
    });
  },

  editar: async (params, grupoId) => {
    return api.put(`api/grupo/${grupoId}/editar/`, params);
  },
};

export default GrupoService;
