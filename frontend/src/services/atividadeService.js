import { api } from '../config/axiosConfig';

const atividadeService = {
  listarAtividades: (pedTipo, pedId) => api.get(`api/listar-atividades/${pedTipo}/${pedId}/`),
  
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

  buscarAtividade: async (pedTipo, pedId, atividadeId) => {
    try {
      const response = await api.get(`api/detalhes-atividade/${pedTipo}/${pedId}/${atividadeId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da atividade:', error);
      throw error;
    }
  },

  editarAtividade: async (pedTipo, pedId, atividadeId, atividadeData) => {
    try {
      const response = await api.put(
        `api/editar-atividade/${pedTipo}/${pedId}/${atividadeId}/`,
        atividadeData, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao editar a atividade:', error);
      throw error;
    }
  },
};

export default atividadeService;

