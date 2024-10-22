import { api } from "../config/axiosConfig";

const endpoints = [
    {
        tipo: "Professor",
        endpoint: "cadastrar-professor/"
    },
    {
        tipo: "RegistroEscolar",
        endpoint: "cadastrar-registro-escolar/"
    },
    {
        tipo: "GestaoEscolar",
        endpoint: "cadastrar-gestao-escolar/"
    },
    {
        tipo: "Coordenador",
        endpoint: "cadastrar-coordenador/"
    },
]

const servidorService = {
    create: async (params) => {
        let endpoint;

        endpoints.forEach((endpointObject) => {
            if (endpointObject.tipo === params.perfil) {
                endpoint = endpointObject.endpoint;
            }
        });

        const res = await api
            .post(`/api/${endpoint}`, params, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .catch((erro) => {
                return { status: erro.response?.status || 500, data: erro.response?.data || { error: 'Erro ao cadastrar servidor' } };
            });

        return res;
    },
};

export default servidorService;
