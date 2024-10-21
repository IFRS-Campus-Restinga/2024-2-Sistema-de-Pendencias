import { api } from "./axiosConfig";

export const createDisciplina = async (data) => {
  try {
    const response = await api.post('/cadastrar-disciplina/', data);
    return response.data;
  } catch (error) {
    console.error("Erro na criação da disciplina", error.response?.data || error.message);
    throw error;
  }
};
