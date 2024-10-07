import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // ou a URL que você estiver usando
  headers: {
      'Content-Type': 'application/json',
  },
});
 //comenteni 
//   baseURL: process.env.BASE_URL,
// }); ate esta parte

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
