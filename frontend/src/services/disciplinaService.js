//import {api} from '../config/axiosConfig';
import axios from "axios";

export const createDisciplina = async (data) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/disciplina/create/', data);
    return response.data;
  } catch (error) {
    console.error("Erro na criação da disciplina", error.response?.data || error.message);
    throw error;
  }
};
