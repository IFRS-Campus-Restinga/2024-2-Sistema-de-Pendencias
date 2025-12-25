import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
  timeout: 15000,
});

/**
 * Controle de refresh
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const is401 = error.response?.status === 401;
    const isRefreshUrl = originalRequest.url?.includes(
      "session/tokens/refresh"
    );

    /**
     * Só tenta refresh se:
     * - for 401
     * - não for a request de refresh
     * - ainda não tentou retry
     */
    if (is401 && !isRefreshUrl && !originalRequest._retry) {
      originalRequest._retry = true;

      /**
       * Se já estiver renovando o token,
       * coloca a request na fila
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await api.get("session/tokens/refresh/");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
