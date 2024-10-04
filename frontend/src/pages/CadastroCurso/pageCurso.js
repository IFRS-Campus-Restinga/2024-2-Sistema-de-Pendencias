import React, { useState } from 'react';
import axios from 'axios';

const CadastroCurso = () => {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [modalidade, setModalidade] = useState('');

  const modalidades = [
    { value: 'online', label: 'Online' },
    { value: 'presencial', label: 'Presencial' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/cursos/', {
        nome,
        carga_horaria: cargaHoraria,
        modalidade
      });
      console.log('Curso cadastrado com sucesso', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar curso', error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Curso</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Curso</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Carga Horária</label>
          <input
            type="text"
            value={cargaHoraria}
            onChange={(e) => setCargaHoraria(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Modalidade</label>
          <select
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
            required
          >
            <option value="">Selecione a Modalidade</option>
            {modalidades.map((mod) => (
              <option key={mod.value} value={mod.value}>
                {mod.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Cadastrar Curso</button>
      </form>
    </div>
  );
};

export default CadastroCurso;
