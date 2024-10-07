//import { api } from "../config/axiosConfig";

import api from '../config/axiosConfig';

//const cursoService = {
  const cursoService = {
    create: async (data) => {
      try {
        const response = await api.post('http://localhost:8000/api/cursos/', data);
        return response.data;
      } catch (error) {
        console.error("Erro ao criar curso:", error);
        throw error; // Re-throw the error to be handled later
      }
    }
  };
  
    // Outras funções do serviço...
// Adicione outras funções do serviço aqui
  // //create: async (params, csrfToken) => {
  //   create: async (params) => {
  //   const res = await api
  //     .post("/cadastrar_curso", params, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         //"X-CSRFToken": csrfToken,
  //       },
  //     })
  //     .catch((erro) => {
  //       return { status: erro.response?.status || 500, data: erro.response?.data || { error: 'Erro ao cadastrar curso' } };
  //   });

  //   return res;
  // },
//};

export default cursoService;
