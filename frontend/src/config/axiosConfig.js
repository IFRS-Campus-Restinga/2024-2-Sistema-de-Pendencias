import axios from "axios";
import Cookies from 'js-cookie'

// Criação da instância do axios
export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL, // URL base da API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para adicionar o token JWT em cada requisição
api.interceptors.request.use(
  (config) => {
    const csrftoken = Cookies.get('csrftoken') // Obtendo o token
    console.log(csrftoken)
    if (csrftoken) {
      config.headers['X-CSRFToken'] = `${csrftoken}`; // Nome correto do header
    }
    return config; // Retorna a configuração da requisição
  },
  (erro) => {
    return Promise.reject(erro); // Retorna erro, se houver
  }
);