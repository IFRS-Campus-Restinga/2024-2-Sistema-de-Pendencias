import {api} from '../config/axiosConfig'

export const loginService = {
    login: async (params) => {
        const res = await api.post('/auth/api/login/google/', params).catch((erro) => {
            return erro
        })

        return res
    },

    logout: async () => {

    }
}

export default loginService