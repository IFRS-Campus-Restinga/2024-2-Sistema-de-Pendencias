import { api } from "../config/axiosConfig"


export const usuarioBaseService = {
    get: async (params, idUsuario) => {
        const res = await api.get(`api/usuario/${idUsuario}/`).catch((erro) => {
            return erro
        })

        return res
    }
}