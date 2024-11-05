import React, { useState, useEffect } from 'react';
import { disciplinaService } from '../../../../services/disciplinaService'; // Serviço para disciplinas
import './CadastroDisciplina'; // Estilos para a página

const ListarDisciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [error, setError] = useState(null);

  const fetchDisciplinas = async () => {
    try {
      const response = await disciplinaService.listar(); // Faz a chamada ao endpoint
      if (response.status === 200) {
        setDisciplinas(response.data);
      } else {
        throw new Error('Erro ao carregar disciplinas');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  return (
    <div className="containerListarDisciplinas">
      <h1>Lista de Disciplinas</h1>
      {error && <p className="error">{error}</p>}
      <table className="disciplinasTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Curso</th>
            <th>Modalidade</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.length > 0 ? (
            disciplinas.map((disciplina) => (
              <tr key={disciplina.id}>
                <td>{disciplina.id}</td>
                <td>{disciplina.name}</td>
                <td>{disciplina.curso.name}</td> {/* Nome do curso */}
                <td>{disciplina.curso.modalidade}</td> {/* Modalidade do curso */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhuma disciplina encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarDisciplinas;
