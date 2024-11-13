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
    getById: async (idServidor) => {
        try {
            const response = await api.get(`/api/servidores/${idServidor}/`);
            return response;
        } catch (error) {
            throw new Error('Erro ao buscar o servidor: ' + error.message);
        }
    },

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

    visualizar: async (idServidor) => {
        try {
            const res = await api.get(`/api/visualizar-servidor/${idServidor}/`);
            return res.data;  // Retorna os dados da resposta caso a requisição seja bem-sucedida
        } catch (erro) {
            // Trata o erro e retorna uma resposta clara de falha
            console.error(`Erro ao visualizar servidor com ID ${idServidor}:`, erro);
            return {
                sucesso: false,
                mensagem: erro.response?.data?.mensagem || 'Erro ao tentar visualizar o servidor.',
                status: erro.response?.status || 500
            };
        }
    },

    editar: async (idServidor, dadosAtualizados) => {
        try {
            console.log("ID do servidor:", idServidor);
            console.log("Dados para editar:", dadosAtualizados);
    
            if (!idServidor) {
                console.error("Nenhum servidor selecionado.");
                return;
            }
    
            const response = await api.put(`/api/editar-servidor/${idServidor}/`, dadosAtualizados);
            
            if (response.status === 200) {
                console.log("Servidor editado com sucesso:", response.data);
                return response.data;
            } else {
                console.error("Falha ao editar servidor:", response.status);
            }
        } catch (error) {
            console.error('Erro ao editar o servidor:', error);
            if (error.response) {
                console.error('Resposta do erro:', error.response);
            }
        }
    },
    

};

export default servidorService;
