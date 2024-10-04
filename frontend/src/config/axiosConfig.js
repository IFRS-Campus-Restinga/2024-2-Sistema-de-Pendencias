import axios from "axios";

const api = axios.create({
  baseURL: process.env.BASE_URL,
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(TOKEN_ACESSO);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;
