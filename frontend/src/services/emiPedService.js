// src/services/emPedService.js
import axios from "axios";

export const createEmiPed = async (data) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-em-ped/', data);
    return response.data; // Retorna os dados recebidos da API
  } catch (error) {
    console.error("Erro ao criar EM - PED:", error.response?.data || error.message);
    throw error; // Lança o erro para ser tratado no componente
  }
};
