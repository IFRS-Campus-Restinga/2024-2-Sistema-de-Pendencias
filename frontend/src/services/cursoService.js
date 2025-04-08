import { api } from '../config/axiosConfig';

export const cursoService = {
    criar: async (data) => {
        try {
            const response = await api.post('/api/curso/cadastrar/', data);
            return response;
        } catch (error) {
            if (error.response?.data?.mensagem) {
                const mensagem = error.response.data.mensagem;
    
                if (Array.isArray(mensagem)) {
                    throw new Error(JSON.stringify(mensagem));
                }
    
                if (typeof mensagem === 'string') {
                    throw new Error(JSON.stringify([mensagem]));
                }
            }
    
            throw new Error(JSON.stringify(["Erro inesperado ao cadastrar curso."]));
        }
    },    

    listar: async (retorno, param, pagina) => {
        try {
            const res = await api.get(`/api/curso/listar`, {
                params: {
                    retorno,
                    page: pagina,
                    page_size: 10,
                    busca: param
                }
            });

            return res;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao buscar cursos");
            }

            throw new Error("Erro inesperado ao buscar cursos");
        }
    },

    editar: async (cursoId, data) => {
        try {
            const response = await api.put(`/api/curso/${cursoId}/editar/`, data);
            return response;
        } catch (error) {
            console.log(error)
            if (error.response?.data?.mensagem) {
                const mensagem = error.response.data.mensagem;
                console.log(mensagem)
                if (Array.isArray(mensagem)) {
                  throw new Error(JSON.stringify(mensagem));
                }
          
                if (typeof mensagem === 'object') {
                  throw new Error(JSON.stringify(Object.values(mensagem).flat()));
                }
          
                if (typeof mensagem === 'string') {
                  throw new Error(JSON.stringify([mensagem]));
                }
              }
          
              throw new Error(JSON.stringify(["Erro inesperado ao editar curso."]));
        }
    },    

    porModalidade: async (modalidade, retorno) => {
        const res = await api.get(`api/listar-cursos/${modalidade}`,{
            params: {
                retorno
            }
        }).catch((erro) => {
            return erro
        })

        return res
    },

    // Método para obter um curso pelo ID
    porId: async (cursoId) => {
        try {
            const res = await api.get(`api/curso/${cursoId}/`, {
                params: {
                    retorno: 'detalhes'
                }
            });
            return res;
        } catch (erro) {
            console.error("Erro ao buscar curso:", erro);
            throw erro;
        }
    },
};

export default cursoService;
