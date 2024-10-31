import { api } from "../config/axiosConfig";
import ListarServidor from "../pages/base/Gestao/listarServidor/ListarServidor";

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

    listar: async () => {
        const res = await api.get('/api/listar-servidores/').catch((erro) => {
            return erro
        })

        return res
    },

    addInfos: async (params) => {
        const res = await api.post('api/dados-adicionais-professor/', params).catch((erro) => {
            return erro
        })

        return res
    },
};

export default servidorService;
