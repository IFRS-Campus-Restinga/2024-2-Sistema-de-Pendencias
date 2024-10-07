import { api } from "../config/axiosConfig";

const servidorService = {
    create: async (params) => {
        const res = await api
            .post("/cadastrar_servidor", params, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .catch((erro) => {
                return { status: erro.response?.status || 500, data: erro.response?.data || { error: 'Erro ao cadastrar servidor' } };
            });

        return res;
    },
};

export default servidorService;
