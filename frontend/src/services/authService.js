import api from "../config/axiosConfig";

export const authService = {
  obterTokens: async (user, system) => {
    const res = await api.get(`session/tokens/`, {
      withCredentials: true,
      params: {
        system,
        user,
      },
    });

    return res;
  },
};
