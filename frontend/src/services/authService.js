import {api} from '../config/axiosConfig'

export const authService = {
    login: async (params) => {
        const res = await api.post('/auth/api/login/google/', params).catch((erro) => {
            return erro
        })

        return res
    },

    logout: async () => {
        const res = await api.post(`/auth/api/logout/google/`).catch((erro) => {
            return erro
        })

        return res
    }
}