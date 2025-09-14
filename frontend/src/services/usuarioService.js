import { api } from "../config/axiosConfig";

export const UsuarioService = {
  criar: async (params) => {
    return api.post("api/usuarios/cadastrar/", params);
  },

  listar: async (perfil, pagina, busca) => {
    return api.get("api/usuarios/listar/", {
      params: {
        perfil,
        pagina,
        busca,
      },
    });
  },

  buscar: async (usuarioId) => {
    return api.get(`api/usuarios/${usuarioId}/detalhes/`);
  },

  editar: async (usuarioId, params) => {
    return api.put(`api/usuarios/${usuarioId}/editar/`, params);
  },

  buscarHub: async (pagina = 1, param = "", perfil, retorno) => {
    return api.get(`hub/usuarios/get/perfil/${perfil}/`, {
      params: {
        retorno,
        busca: param,
        ativo: true,
        pagina,
      },
    });
  },
};
