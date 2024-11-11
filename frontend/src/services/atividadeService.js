import { api } from '../config/axiosConfig';

const atividadeService = {
    criar: async (params) => {
      const res = await api.post('api/ped/criar-atividade/', params).catch((erro) => {
        return erro
      })

      return res
    },

    listarAtividades: (pedTipo, pedId) => api.get(`api/listar-atividades/${pedTipo}/${pedId}/`), // Certifique-se de que a URL está correta
  };
export default atividadeService;