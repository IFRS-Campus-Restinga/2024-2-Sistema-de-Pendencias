import { api } from "../config/axiosConfig"


export const usuarioBaseService = {
    get: async (idUsuario) => {
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
    }
}