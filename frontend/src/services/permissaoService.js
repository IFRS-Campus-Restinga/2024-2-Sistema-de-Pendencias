import { api } from "../config/axiosConfig";

const PermissaoService = {
  listar: async (pagina = 1) => {
    return api.get(`api/permissoes/listar/`, {
      params: {
        retorno: "id, codename",
        page: pagina,
      },
    });
  },

  listarPorGrupo: async (grupoId, pagina = 1) => {
    return api.get(`api/permissoes/listar/${grupoId}/`, {
      params: {
        retorno: "id, codename",
        page: pagina,
      },
    });
  },

  naoVinculadas: async (grupoId, pagina = 1) => {
    return api.get(`api/permissoes/listar/${grupoId}/nao_vinculadas/`, {
      params: {
        retorno: "id, codename",
        page: pagina,
      },
    });
  },
};

export default PermissaoService;
