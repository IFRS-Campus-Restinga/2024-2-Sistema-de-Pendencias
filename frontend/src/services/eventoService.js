import { apiHub } from "../config/axiosConfig";

const eventoService = {
  buscarPorMes: async (mes = new Date().getMonth()) => {
    return await apiHub.get("/api/calendar/event/get/", {
      params: {
        data_format: "list",
        search: mes,
      },
    });
  },

  buscarPorId: async (eventoId) => {
    return await apiHub.get(`api/calendar/event/get/${eventoId}`, {
      params: {
        data_format: "details",
      },
    });
  },
};

export default eventoService;
