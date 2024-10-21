import React, { useState, useEffect } from 'react';
import Button from "../../components/Button/Button";
import { createDisciplina } from "../../services/disciplinaService"; // Importa a função para criar disciplina
import "./CadastroDisciplina.css"; // Crie um novo CSS para a página

const CadastroDisciplina = () => {
  const [formData, setFormData] = useState({
    curso: '',
    nomeDisciplina: '',
    cargaHoraria: ''
  });
  const [cursos, setCursos] = useState([]);
  const [message, setMessage] = useState('');

  // Função para buscar cursos disponíveis
  const fetchCursos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listar-curso/');
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error('Erro ao buscar cursos!', error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createDisciplina(formData);
      if (response) {
        setMessage('Disciplina cadastrada com sucesso!');
        setFormData({ curso: '', nomeDisciplina: '', cargaHoraria: '' });
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
            onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
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
            value={formData.nomeDisciplina}
            onChange={(e) => setFormData({ ...formData, nomeDisciplina: e.target.value })}
            placeholder="Nome da Disciplina"
            required
          />
        </div>
        <div>
          <label htmlFor="cargaHoraria">Carga Horária:</label>
          <input
            type="number"
            id="cargaHoraria"
            value={formData.cargaHoraria}
            onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
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
      {message && <div>{message}</div>}
    </div>
  );
};

export default CadastroDisciplina;
