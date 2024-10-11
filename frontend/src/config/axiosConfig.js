import axios from "axios";
import { TOKEN_ACESSO } from "./const"; // Importando TOKEN_ACESSO

// Criação da instância do axios
export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api", // URL base da API
});
 //comenteni 
//   baseURL: process.env.BASE_URL,
// }); ate esta parte

// Função para obter o valor de um cookie pelo nome
function obterCookie(nome) {
  let valorCookie = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";"); // Divide os cookies
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Verifica se o cookie atual é o que estamos procurando
      if (cookie.substring(0, nome.length + 1) === nome + "=") {
        valorCookie = decodeURIComponent(cookie.substring(nome.length + 1));
        break;
      }
    }
  }
  return valorCookie;
}

// Interceptor para adicionar o token CSRF em cada requisição
api.interceptors.request.use(
  (config) => {
    const csrftoken = obterCookie("csrftoken"); // Obtendo o token CSRF
    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken; // Adicionando o token ao header
    }
    return config; // Retorna a configuração da requisição
  },
  (erro) => {
    return Promise.reject(erro); // Retorna erro, se houver
  }
);

// Interceptor para adicionar o token de autenticação em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_ACESSO); // Obtendo o token de acesso
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adicionando o token ao header
    }
    return config; // Retorna a configuração da requisição
  },
  (error) => {
    return Promise.reject(error); // Retorna erro, se houver
  }
);
