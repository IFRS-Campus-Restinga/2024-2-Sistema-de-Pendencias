import { api } from '../config/axiosConfig';

const atividadeService = {
    listarAtividades: (pedTipo, pedId) => api.get(`api/listar-atividades/${pedTipo}/${pedId}/`),
    
    atualizarNotaFinal: (pedTipo, pedId, notaFinal) => 
      api.put(`api/atualizar-nota-final/${pedTipo}/${pedId}/`, { nota_final: notaFinal }),
  };
export default atividadeService;
