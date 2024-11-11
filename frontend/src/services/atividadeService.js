import { api } from '../config/axiosConfig';

const atividadeService = {
  listarAtividades: (pedId) => api.get(`api/listar-atividades/${pedId}/`),
};

export default atividadeService;