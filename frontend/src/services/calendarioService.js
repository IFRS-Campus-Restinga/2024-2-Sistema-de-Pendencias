import { api, apiHub } from "../config/axiosConfig";

export const calendarioAcademicoService = {
  buscar: async (pagina = 1, param = "") => {
    return await apiHub.get("api/calendar/get/", {
      params: {
        page: pagina,
        data_format: "search",
        search: param,
      },
    });
  },
};
