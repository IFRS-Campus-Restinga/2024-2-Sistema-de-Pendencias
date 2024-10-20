import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { validarFormularioCurso } from './validacoes'; // Importa suas funções de validação
import "./CadastroCurso.css";

const CadastroCurso = () => {
  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [error, setError] = useState(null);

  const opcoesCursos = [
    "eletrônica",
    "lazer",
    "informática",
    "comércio",
    "agroecologia"
  ];

  const addTurma = () => {
    setTurmas([...turmas, { numero: "" }]);
  };

  const handleTurmaChange = (index, value) => {
    const newTurmas = [...turmas];
    newTurmas[index].numero = value;
    setTurmas(newTurmas);
  };

  const removeTurma = (index) => {
    const newTurmas = turmas.filter((_, i) => i !== index);
    setTurmas(newTurmas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crie um objeto com os dados do formulário
    const formData = {
      nome,
      cargaHoraria,
      modalidade,
      turmas,
    };

    // Valide os dados do formulário
    const erros = validarFormularioCurso(formData);
    
    if (Object.keys(erros).length > 0) {
      setError(erros); // Armazene os erros no estado
      return; // Não envie o formulário se houver erros
    }

    // Se não houver erros, prossiga com o envio do formulário
    try {
      const turmasIds = turmas
        .map((turma) => turma.numero)
        .filter((numero) => numero.trim() !== ""); // Obter os números das turmas

      const response = await axios.post(
        "http://127.0.0.1:8000/api/cadastrar-curso/",
        {
          nome,
          carga_horaria: cargaHoraria,
          modalidade,
          turmas: turmasIds,
        }
      );
      console.log("Curso cadastrado com sucesso", response.data);

      // Limpe os campos após o cadastro
      setNome("");
      setCargaHoraria("");
      setModalidade("");
      setTurmas([]);
      setMensagem("Curso cadastrado com sucesso!");
      setError(null); // Limpa os erros após o sucesso

    } catch (error) {
      console.error(
        "Erro ao cadastrar curso",
        error.response ? error.response.data : error.message
      );
      setMensagem("Erro ao cadastrar o curso.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Cadastro Curso</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      {error && <p className="error">{error.global || "Verifique os campos."}</p>} {/* Mensagem de erro global */}

      <div className="modalidade-container">
        <h4>Modalidade:</h4>
        <div className="containerOpcoes">
          <label className="modalidadeLabel">
            <input
              type="radio"
              name="modalidade"
              value="PROEJA"
              onChange={(e) => setModalidade(e.target.value)}
              checked={modalidade === "PROEJA"} // Mantém o estado do radio
            />
            ProEja
          </label>
          <label className="modalidadeLabel">
            <input
              type="radio"
              name="modalidade"
              value="INTEGRADO" // Corrigido para "INTEGRADO"
              onChange={(e) => setModalidade(e.target.value)}
              checked={modalidade === "INTEGRADO"} // Mantém o estado do radio
            />
            Integrado
          </label>
        </div>
        {error && error.modalidade && <p className="error">{error.modalidade}</p>} {/* Exibe erro da modalidade */}
      </div>

      <div className="input-group">
        <label htmlFor="nome_curso">Nome do Curso:</label>
        <select
          name="nome_curso"
          id="nome_curso"
          value={nome}
          className={error && error.nome ? 'error-input' : ''}
          onChange={(e) => setNome(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          {opcoesCursos.map((curso, index) => (
            <option key={index} value={curso}>
              {curso}
            </option>
          ))}
        </select>
        {error && error.nome && <p className="error">{error.nome}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="carga_horaria">Carga Horária:</label>
        <input
          type="text"
          name="carga_horaria"
          id="carga_horaria"
          value={cargaHoraria}
          className={error && error.carga_horaria ? 'error-input' : ''}
          onChange={(e) => setCargaHoraria(e.target.value)}
        />
        {error && error.carga_horaria && <p className="error">{error.carga_horaria}</p>}
      </div>

      <div className="add-turma">
        <button type="button" onClick={addTurma} className="add-button">
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ color: "#28A745", cursor: "pointer", fontSize: "24px" }}
          />
          <span style={{ color: "black" }}> Adicionar Turma</span>
        </button>
      </div>

      {turmas.length > 0 && (
        <div className="turmas-lista">
          <h4>Turmas a serem adicionadas:</h4>
          <table className="turmas-tabela">
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
                      className={`turmaInput ${error && error.turmas && error.turmas[index] ? 'error-input' : ''}`}
                      value={turma.numero}
                      onChange={(e) => handleTurmaChange(index, e.target.value)}
                      placeholder="Digite o número da turma"
                    />
                    {error && error.turmas && error.turmas[index] && <p className="error">{error.turmas[index]}</p>}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                      onClick={() => removeTurma(index)}
                    />
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
        style={{ marginTop: "20px" }}
      >
        Cadastrar Curso
      </button>
    </form>
  );
};

export default CadastroCurso;
