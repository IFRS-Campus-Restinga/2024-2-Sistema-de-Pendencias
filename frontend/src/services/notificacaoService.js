import { api } from "../config/axiosConfig"


export const notificacaoService = {
    buscar: async () => {
        const res = await api.get(`api/notificacoes/`).catch((erro) => {
            return erro
        })

        return res
    },

    trocar_status: async (idNotificacao) => {
        const res = await api.post(`api/notificacoes/troca-status/${idNotificacao}/`).catch((erro) => {
            return erro
        })

        return res
    }
} 