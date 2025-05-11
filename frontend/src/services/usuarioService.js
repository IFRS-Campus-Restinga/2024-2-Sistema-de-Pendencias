import { api } from "../config/axiosConfig"


export const UsuarioService = {
    criar: async (params) => {
        try {
            const res = await api.post('api/usuario/cadastrar/', params);
            return res; 
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar usuário");
            }
            throw new Error("Erro inesperado ao cadastrar usuário");
        }
    },

    porId: async (idUsuario) => {
        try {
            const res = await api.get(`api/usuario/${idUsuario}/`)
            return res; 
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao buscar usuário");
            }
            throw new Error("Erro inesperado ao buscar usuário");
        }
    },

    buscarPorParametro: async (param, grupo) => {
        const res = await api.get(`api/usuario/${param}/${grupo}`, {
            params: {
                retorno: 'dependencia'
            }
        }).catch((erro) => {
            return erro
        })

        return res
    },

    listarGrupos: async () => {
        const res = await api.get(`api/listar-grupos/`).catch((erro) => {
            return erro
        })

        return res
    },

    listarPorGrupo: async (perfil, param, pagina) => {
        try {
            const res = await api.get(`api/usuario/listar/${perfil}/`, {
                params: {
                    retorno: 'lista',
                    page: pagina,
                    page_size: 10,
                    busca: param
                }
            });
            
            return res; 
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao buscar usuários");
            }

            throw new Error("Erro inesperado ao buscar usuários");
        }    
    }, 

    editar: async (idUsuario, params) => {
        try {
          const response = await api.put(`/api/usuario/${idUsuario}/editar/`, params);
          return response;
        } catch (error) {
            console.log(error)
          if (error.response?.data?.mensagem) {
            const mensagem = error.response.data.mensagem;
            console.log(mensagem)
            if (Array.isArray(mensagem)) {
              throw new Error(JSON.stringify(mensagem));
            }
      
            if (typeof mensagem === 'object') {
              throw new Error(JSON.stringify(Object.values(mensagem).flat()));
            }
      
            if (typeof mensagem === 'string') {
              throw new Error(JSON.stringify([mensagem]));
            }
          }
      
          throw new Error(JSON.stringify(["Erro inesperado ao editar usuário."]));
        }
      }
      
}