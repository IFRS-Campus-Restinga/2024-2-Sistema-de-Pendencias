import { api } from "../config/axiosConfig";

export const calendarioAcademicoService  = {
   criarCalendarioAcademico: async (params) => {
        try {
            const res = await api.post('/api/cadastrar-calendario-academico/', params);
            return res;
        } catch (error) {
            console.error("Erro ao cadastrar calendário acadêmico:", error);
            throw error;
        }
    },

    listarCalendariosAcademicos: async () => {
        try {
            const res = await api.get('/api/listar-calendarios-academicos/');
            return res;
        } catch (error) {
            console.error("Erro ao listar calendários acadêmicos:", error);
            throw error;
        }
    },

    listarEventosDoCalendario: async (idCalendario) => {
        try {
            const res = await api.get(`/api/calendario-academico/${idCalendario}/eventos/`);
            return res;
        } catch (error) {
            console.error("Erro ao listar eventos do calendário acadêmico:", error);
            throw error;
        }
    }

};