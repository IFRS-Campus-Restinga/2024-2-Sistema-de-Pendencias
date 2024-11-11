import { api } from '../config/axiosConfig';

const atividadeService = {
    listarAtividades: (pedTipo, pedId) => api.get(`api/listar-atividades/${pedTipo}/${pedId}/`), // Certifique-se de que a URL está correta
  };
export default atividadeService;