import { api } from "../config/axiosConfig"


export const notificacaoService = {
    buscar: async (idusuario) => {
        const res = await api.get(`api/notificacoes/${idusuario}/`).catch((erro) => {
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