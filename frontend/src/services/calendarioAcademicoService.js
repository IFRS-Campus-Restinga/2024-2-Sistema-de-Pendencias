import { api } from "../config/axiosConfig";

export const calendarioAcademicoService  = {
   criar: async (params) => {
        try {
            const res = await api.post('/api/calendario/cadastrar/', params);
            return res;
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

        throw new Error(JSON.stringify(["Erro inesperado ao cadastrar calendário."]));
        }
    },

    listar: async (retorno, param, pagina) => {
      try {
          const res = await api.get(`/api/calendario/listar/`, {
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
              throw new Error(error.response.data.mensagem || "Erro ao buscar calendarios");
          }

          throw new Error("Erro inesperado ao buscar calendarios");
      }
  },

  porId: async (idCalendario, mes, ano) => {
      try {
          const res = await api.get(`/api/calendario/${idCalendario}/eventos/`, {
            params: {
              mes,
              ano,
              retorno: 'detalhes'
            }
          });
          return res;
      } catch (error) {
          console.error("Erro ao obter calendário acadêmico:", error);
          throw error;
      }
  },

  editar: async (idCalendario, params) => {
    try {
      const res = await api.put(`/api/atualizar-calendario-academico/${idCalendario}/`, params);
      return res;
    } catch (error) {
      console.error("Erro ao atualizar calendário acadêmico:", error);
      throw error;
    }
  },

  criarEvento: async (params) => {
    try {
      const res = await api.post('/api/evento/cadastrar/', params);
      return res;
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

      throw new Error(JSON.stringify(["Erro inesperado ao cadastrar evento."]));
    }
  },

  editarEvento: async (eventoId, params) => {
    try {
      const res = await api.post(`/api/evento/${eventoId}/editar/`, params);
      return res;
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

      throw new Error(JSON.stringify(["Erro inesperado ao editar evento."]));
    }
  }

};