import { api } from '../config/axiosConfig';

const atividadeService = {
  criar: async (modalidade, params) => {
    const res = await api.post(`/api/atividade/cadastro/${modalidade}/`, params, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  vincular: async (pedId, modalidade, params) => {
    const res = await api.post(`/api/plano-atividades/vincular/${pedId}/${modalidade}/`, params).catch((erro) => {
      return erro
    })

    return res
  },

  porId: async (atividadeId, modalidade) => {
    const res = await api.get(`/api/plano-atividades/detalhes/${modalidade}/${atividadeId}/`, {
      params: {
        retorno: 'detalhes'
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  listarPorPED: async (pedId, modalidade) => {
      const res = await api.get(`/api/plano-atividades/${pedId}/${modalidade}/`, {
        params: {
          retorno: 'listar'
        }
      }).catch((erro) => {
        return erro
      });

      return res
  },

  listarPorProfessor: async () => {
    const res = await api.get(`/api/atividade/listar/`, {
      params: {
        retorno: 'listar'
      }
    }).catch((erro) => {
      return erro
    })

    return res
  },

  editar: async (atividadeId, modalidade, params) => {
    try {
      const response = await api.put(
        `api/plano-atividades/editar/${modalidade}/${atividadeId}/`,
        params, 
        {
          headers: {
            "Content-Type": 'multipart/form-data'
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Erro ao editar a atividade:', error);
      throw error;
    }
  },
  
  atualizarNotaFinal: (pedTipo, pedId, notaFinal) => 
    api.put(`api/atualizar-nota-final/${pedTipo}/${pedId}/`, { nota_final: notaFinal }),

  // Adicionando a atividade da mesma forma que os outros serviços
  adicionarAtividade: async (pedTipo, pedId, atividadeData) => {
    try {
      // Adiciona automaticamente a referência à PED (ped_emi ou ped_proeja) no payload
      const payload = {
        ...atividadeData, // Dados enviados do formulário (ex: nome, descrição, etc.)
        ped_emi: pedTipo === 'emi' ? pedId : undefined, // Se o tipo for 'emi', adiciona ped_emi
        ped_proeja: pedTipo === 'proeja' ? pedId : undefined, // Se for 'proeja', adiciona ped_proeja
      };
  
      const response = await api.post(
        `api/adicionar-atividades/${pedTipo}/${pedId}/`, // A URL base para o endpoint
        payload, // O payload com os dados ajustados
        {
          headers: {
            'Content-Type': 'application/json', // Certifique-se de que o cabeçalho seja correto
          },
        }
      );
      return response.data; // Retorna os dados da resposta do backend
    } catch (error) {
      console.error('Erro ao adicionar a atividade:', error);
      throw error; // Propaga o erro para ser tratado onde o método for chamado
    }
  },

  deletarAtividade: async (pedTipo, pedId, atividadeId) => {
    try {
      const response = await api.delete(`api/deletar-atividade/${pedTipo}/${pedId}/${atividadeId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      throw error;
    }
  },

  adicionarPlanoAtividades: async (pedTipo, pedId, formData) => {
    try {
      const response = await api.post(
        `api/adicionar-plano-atividades/${pedTipo}/${pedId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar plano de atividades:', error);
      throw error;
    }
  },

  exibirNotaFinal: async (pedTipo, pedId) => {
    try {
      const response = await api.get(`api/exibir_nota_final/${pedTipo}/${pedId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao exibir nota final:', error);
      throw error;
    }
  },
  
};

export default atividadeService;

