import api from "../config/axiosConfig";

export const authService = {
  obterTokens: async (user) => {
    const res = await api.get(`session/tokens/`, {
      withCredentials: true,
      params: {
        user,
      },
    });

    return res;
  },

  logout: async () => {
    return await api.post("/session/logout/");
  },
};
