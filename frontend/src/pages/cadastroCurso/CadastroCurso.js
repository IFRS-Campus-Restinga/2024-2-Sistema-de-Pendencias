import React, { useState } from 'react';
import axios from 'axios';
import './CadastroCurso.css'; 
// import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

const CadastroCurso = () => {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [turmas, setTurmas] = useState([]); // Estado das turmas a serem adicionadas
  const [mensagem, setMensagem] = useState(null); // Para feedback visual

  // Função para adicionar uma nova turma
  const addTurma = () => {
    setTurmas([...turmas, { numero: '' }]); // Adiciona turma com campo "numero"
  };

  // Função para atualizar o número da turma
  const handleTurmaChange = (index, value) => {
    const newTurmas = [...turmas];
    newTurmas[index].numero = value; // Atualiza "numero"
    setTurmas(newTurmas);
  };

  // Função para remover uma turma
  const removeTurma = (index) => {
    const newTurmas = turmas.filter((_, i) => i !== index);
    setTurmas(newTurmas);
  };

  // Função para enviar os dados do curso
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const turmasIds = turmas.map(turma => turma.numero).filter(numero => numero.trim() !== ''); // Obter os números das turmas

      const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-curso/', {
        nome,
        carga_horaria: cargaHoraria,
        modalidade,
        turmas: turmasIds // Enviando os números das turmas
      });
      console.log('Curso cadastrado com sucesso', response.data);
      
      // Limpar o formulário após o sucesso
      setNome('');
      setCargaHoraria('');
      setModalidade('');
      setTurmas([]); // Limpar turmas
      setMensagem('Curso cadastrado com sucesso!'); // Exibir mensagem de sucesso
    } catch (error) {
      console.error('Erro ao cadastrar curso', error.response ? error.response.data : error.message);
      setMensagem('Erro ao cadastrar o curso.'); // Exibir mensagem de erro
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h1>Cadastro Curso</h1>

      {mensagem && <p className='mensagem'>{mensagem}</p>} {/* Exibir mensagem de feedback */}

      <div className='modalidade-container'>
        <h4>Modalidade:</h4>
        <div className='containerOpcoes'>
          <label className='modalidadeLabel'>
            <input
              type="radio"
              name="modalidade"
              value="PROEJA"
              onChange={(e) => setModalidade(e.target.value)}
            />
            ProEja
          </label>
          <label className='modalidadeLabel'>
            <input
              type="radio"
              name="modalidade"
              value="EMI"
              onChange={(e) => setModalidade(e.target.value)}
            />
            Integrado
          </label>
        </div>
      </div>

      <div className='input-group'>
        <label htmlFor="nome_curso">Nome do Curso:</label>
        <input
          type="text"
          name="nome_curso"
          id="nome_curso"
          value={nome}
          required
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className='input-group'>
        <label htmlFor="carga_horaria">Carga Horária:</label>
        <input
          type="text"
          name="carga_horaria"
          id="carga_horaria"
          value={cargaHoraria}
          required
          onChange={(e) => setCargaHoraria(e.target.value)}
        />
      </div>

      <div className='add-turma'>
        <button
          type="button"
          onClick={addTurma}
          className="add-button"
        >
          {/* <FaPlusCircle size={24} style={{ color: '#28A745' }} /> */}
          <span>Adicionar Turma</span>
        </button>
      </div>

      {turmas.length > 0 && (
        <div className='turmas-lista'>
          <h4>Turmas a serem adicionadas:</h4>
          <table className='turmas-tabela'>
            <thead>
              <tr>
                <th>Número da Turma</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="turmaInput"
                      value={turma.numero} 
                      onChange={(e) => handleTurmaChange(index, e.target.value)}
                      required
                      placeholder="Digite o número da turma"
                    />
                  </td>
                  <td>
                    {/* <FaTrashAlt
                      size={20}
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => removeTurma(index)}
                    /> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="submit"
        className="submitButton"
        style={{ marginTop: '20px' }}
      >
        Cadastrar Curso
      </button>
    </form>
  );
  
};

export default CadastroCurso;
