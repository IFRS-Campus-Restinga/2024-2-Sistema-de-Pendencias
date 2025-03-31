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
        const res = await api.get(`api/usuario/${idUsuario}/`).catch((erro) => {
            return erro
        })

        return res
    },

    buscarPorParametro: async (param, grupo) => {
        const res = await api.get(`api/usuarios/${param}/${grupo}`).catch((erro) => {
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
            const res = await api.get(`api/usuarios/listar/${perfil}/`, {
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
        const res = await api.post(`api/usuario/editar/${idUsuario}/`, params).catch((erro) => {
            return erro
        })
    }
}