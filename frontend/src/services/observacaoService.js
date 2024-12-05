import { api } from '../config/axiosConfig';

export const observacaoService = {
  adicionarObservacao: async (pedTipo, pedId, observacaoData) => {
    try {
      const payload = {
        ...observacaoData,
        ped_emi: pedTipo === 'emi' ? pedId : undefined,
        ped_proeja: pedTipo === 'proeja' ? pedId : undefined,
      };

      const response = await api.post(
        `api/adicionar-observacao/${pedTipo}/${pedId}/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar a observação:', error);
      throw error;
    }
  },
};

