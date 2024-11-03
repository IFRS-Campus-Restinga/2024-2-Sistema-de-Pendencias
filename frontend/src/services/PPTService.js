import { api } from "../config/axiosConfig"


export const PPTService = {
    create: async () => {

    },

    list: async () => {
        const res = await api.get('api/listar-ppt/').catch((erro) => {
            return erro
        })

        return res
    }
}