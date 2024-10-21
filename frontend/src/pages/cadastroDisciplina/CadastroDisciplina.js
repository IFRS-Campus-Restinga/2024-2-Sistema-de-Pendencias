import React, { useState, useEffect } from 'react';
import Button from "../../components/Button/Button";
import { createDisciplina } from "../../services/disciplinaService"; // Importa a função para criar disciplina
import "./CadastroDisciplina.css"; // CSS para a página

const CadastroDisciplina = () => {
  const [formData, setFormData] = useState({
    curso: '',
    nome: '',
    carga_horaria: ''
  });
  const [cursos, setCursos] = useState([]);
  const [message, setMessage] = useState('');

  // Função para buscar cursos disponíveis
  const fetchCursos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listar-cursos/');
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error('Erro ao buscar cursos!', error);
      setMessage('Erro ao buscar cursos!'); // Adiciona mensagem de erro
    }
  };

  useEffect(() => {
    fetchCursos(); // Chama a função fetchCursos
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData); // Log dos dados do formulário
    try {
      const response = await createDisciplina(formData); // Envia os dados do formulário
      if (response) {
        setMessage('Disciplina cadastrada com sucesso!');
        setFormData({ curso: '', nome: '', carga_horaria: 0 }); // Reseta o formulário após o sucesso
      }
    } catch (error) {
      setMessage('Erro ao cadastrar disciplina!');
      console.error('Erro ao cadastrar disciplina!', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Cadastro Disciplina</h3>
        <hr />
        <div>
          <label htmlFor="curso">Curso:</label>
          <select
            id="curso"
            value={formData.curso}
            onChange={(e) => setFormData({ ...formData, curso: e.target.value })} // Mantém como string
            required
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nomeDisciplina">Nome da Disciplina:</label>
          <input
            type="text"
            id="nomeDisciplina"
            value={formData.nome} // Altera de 'name' para 'nome'
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome da Disciplina"
            required
          />
        </div>
        <div>
          <label htmlFor="cargaHoraria">Carga Horária:</label>
          <input
            type="number"
            id="cargaHoraria"
            value={formData.carga_horaria}
            onChange={(e) => {
              const value = Math.max(0, Math.min(800, Number(e.target.value))); // Limita a carga horária entre 0 e 800
              setFormData({ ...formData, carga_horaria: value });
            }}
            placeholder="Carga Horária"
            required
          />
        </div>
        <div className="ajuste-button">
          <Button
            width="30%"
            color="#28A745"
            text="Cadastrar"
            type="submit"
          />
        </div>
      </form>
      {message && <div>{message}</div>} {/* Mensagem de sucesso ou erro */}
    </div>
  );
};

export default CadastroDisciplina;
