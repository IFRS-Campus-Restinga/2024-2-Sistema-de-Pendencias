import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

function obterCookie(nome) {
  let valorCookie = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, nome.length + 1) === nome + "=") {
        valorCookie = decodeURIComponent(cookie.substring(nome.length + 1));
        break;
      }
    }
  }
  return valorCookie;
}

api.interceptors.request.use(
  (config) => {
    const csrftoken = obterCookie("csrftoken");
    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }
    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

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
