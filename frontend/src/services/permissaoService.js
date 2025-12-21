import { api } from "../config/axiosConfig";

const PermissaoService = {
  listar: async (pagina = 1, _) => {
    return api.get(`api/permissoes/listar/`, {
      params: {
        retorno: "id, name",
        page: pagina,
      },
    });
  },

  listarPorGrupo: async (grupoId, pagina = 1, _) => {
    return api.get(`api/permissoes/listar/${grupoId}/`, {
      params: {
        retorno: "id, name",
        page: pagina,
      },
    });
  },

  naoVinculadas: async (grupoId, pagina = 1, _) => {
    return api.get(`api/permissoes/listar/${grupoId}/nao_vinculadas/`, {
      params: {
        retorno: "id, name",
        page: pagina,
      },
    });
  },
};

export default PermissaoService;
