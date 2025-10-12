import { api } from "../config/axiosConfig";

export const UsuarioService = {
  criar: async (params) => {
    return api.post("api/usuarios/cadastrar/", params);
  },

  listarGrupo: async (grupo, pagina = 1, busca, retorno) => {
    return api.get(`api/usuarios/listar/grupo/${grupo}/`, {
      params: {
        pagina,
        busca,
        retorno,
      },
    });
  },

  listarPerfil: async (perfil, pagina = 1, busca, retorno, ultimo) => {
    return api.get(`api/usuarios/listar/perfil/${perfil}/`, {
      params: {
        pagina,
        busca,
        retorno,
        ...(ultimo && {
          ultimo: ultimo.id,
          data_criacao: ultimo.created_at,
        }),
      },
    });
  },

  obter: async (usuarioId) => {
    return api.get(`api/usuarios/${usuarioId}/`);
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
