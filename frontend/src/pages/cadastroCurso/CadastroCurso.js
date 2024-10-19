import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CadastroCurso.css";

const CadastroCurso = () => {
  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [turmasExistentes, setTurmasExistentes] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [error, setError] = useState(null);
  const [cursoSelecionado, setCursoSelecionado] = useState(""); // Para selecionar o curso
  const [cursos, setCursos] = useState([]); // Para armazenar os cursos disponíveis

  // Fetching cursos existentes
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/listar-cursos/");
        // Remover duplicatas
        const cursosUnicos = response.data.filter(
          (curso, index, self) =>
            index === self.findIndex((c) => c.id === curso.id)
        );
        setCursos(cursosUnicos);
      } catch (error) {
        setError("Erro ao carregar os cursos.");
      }
    };

    fetchCursos();
  }, []);

  // Fetching turmas based on the selected course
  useEffect(() => {
    const fetchTurmasExistentes = async () => {
      if (cursoSelecionado) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/listar-turmas/?curso_id=${cursoSelecionado}`
          );
          setTurmasExistentes(response.data);
        } catch (error) {
          setError("Erro ao carregar as turmas existentes.");
        }
      }
    };

    fetchTurmasExistentes();
  }, [cursoSelecionado]);

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

      setNome("");
      setCargaHoraria("");
      setModalidade("");
      setTurmas([]);
      setMensagem("Curso cadastrado com sucesso!");

      // Atualiza as turmas após cadastro
      const updatedTurmas = await axios.get("http://127.0.0.1:8000/api/listar-turmas/");
      setTurmasExistentes(updatedTurmas.data);
    } catch (error) {
      console.error(
        "Erro ao cadastrar curso",
        error.response ? error.response.data : error.message
      );
      setMensagem("Erro ao cadastrar o curso.");
    }
  };

  return (
    <div className="cadastro-curso-container">
      {/* Formulário de Cadastro de Curso */}
      <form className="form" onSubmit={handleSubmit}>
        <h1>Cadastro Curso</h1>
        {mensagem && <p className="mensagem">{mensagem}</p>}
        {error && <p className="error">{error}</p>}

        <div className="modalidade-container">
          <h4>Modalidade:</h4>
          <div className="containerOpcoes">
            <label className="modalidadeLabel">
              <input
                type="radio"
                name="modalidade"
                value="PROEJA"
                onChange={(e) => setModalidade(e.target.value)}
              />
              ProEja
            </label>
            <label className="modalidadeLabel">
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

        <div className="input-group">
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

        <div className="input-group">
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

        <div className="add-turma">
          <button type="button" onClick={addTurma} className="add-button">
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={{ color: "#28A745", cursor: "pointer", fontSize: "24px" }}
            />
            <span>Adicionar Turma</span>
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
                        className="turmaInput"
                        value={turma.numero}
                        onChange={(e) => handleTurmaChange(index, e.target.value)}
                        required
                        placeholder="Digite o número da turma"
                      />
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

      {/* Seção de Listagem de Turmas Existentes após o formulário */}
      <div className="turmas-selecionadas">
        <h2>Listar Turmas por Curso</h2>
        <div className="input-group">
          <label htmlFor="curso">Selecionar Curso:</label>
          <select
            name="curso"
            id="curso"
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>

        {cursoSelecionado && turmasExistentes.length > 0 ? (
          <table className="turmas-tabela">
            <thead>
              <tr>
                <th>Número da Turma</th>
              </tr>
            </thead>
            <tbody>
              {turmasExistentes.map((turma) => (
                <tr key={turma.id}>
                  <td>{turma.numero}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          cursoSelecionado && <p>Nenhuma turma cadastrada para este curso.</p>
        )}
      </div>
    </div>
  );
};

export default CadastroCurso;
