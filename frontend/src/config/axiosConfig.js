import axios from "axios";

// Criação da instância do axios
export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
});

export const apiHub = axios.create({
  baseURL: process.env.REACT_APP_BASE_SYSTEM_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/token/refresh/`,
          null,
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (err) {
        console.log("Erro ao renovar o token:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
