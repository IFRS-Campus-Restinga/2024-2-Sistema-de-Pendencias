import axios from "axios";

// Criação da instância do axios
export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL, // URL base da API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para adicionar o token JWT em cada requisição
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                    null,
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.access;
                sessionStorage.setItem("access", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

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
