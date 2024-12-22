import { api } from '../config/axiosConfig';

export const cursoService = {
    criar: async (data) => {
        try {
            const response = await api.post('/api/cadastrar-curso/', data);
            return response;
        } catch (error) {
            console.error('Erro ao criar curso:', error);
            throw error; // Lança o erro para que o chamador possa lidar com ele
        }
    },

    listar: async (retorno) => {
        try {
            const response = await api.get(`/api/listar-cursos/`, {
                params: {
                    retorno
                }
            });
            return response;
        } catch (error) {
            console.error('Erro ao listar cursos:', error);
            throw error; // Lança o erro
        }
    },

    // Método para atualizar um curso
    editar: async (idCurso, params) => {
        try {
            const res = await api.put(`api/curso/${idCurso}/editar`, params); // Endpoint de edição de curso
            return res;
        } catch (erro) {
            console.error("Erro ao atualizar curso:", erro);
            throw erro;
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
    getCursoById: async (curso_id,retorno) => {
        try {
            const res = await api.get(`api/cursos/${curso_id}/`, {
                params: {
                    retorno
                }
            }); // Endpoint para pegar curso por ID
            return res;
        } catch (erro) {
            console.error("Erro ao buscar curso:", erro);
            throw erro;
        }
    },
};

export default cursoService;
