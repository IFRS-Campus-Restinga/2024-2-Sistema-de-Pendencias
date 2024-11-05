import React, { useState, useEffect } from "react";
import { emiPedService } from "../../../../services/emiPedService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { validarFormularioEmiPed, validarCampo } from "./validacoes";
import "./cadastroEmiPed.css";

const CadastroEmiPed = () => {
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [turma, setTurma] = useState("");
  const [turmaPed, setTurmaPed] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [trimestreRecuperar, setTrimestreRecuperar] = useState("");
  const [docenteResponsavel, setDocenteResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");
  
  // Estados adicionais
  const [status, setStatus] = useState("criada"); // Valor padrão "criada"
  const [dataInicio, setDataInicio] = useState(""); 
  const [dataFim, setDataFim] = useState(""); 
  const [data, setData] = useState("");
  const [curso, setCurso] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchCursos = async () => {
    // Lógica para buscar os cursos
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleBlur = (campo, valor) => {
    const erro = validarCampo(campo, valor);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [campo]: erro,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      matricula,
      nome,
      curso: cursoId,
      turma,
      turmaPed,
      disciplina,
      trimestreRecuperar,
      docenteResponsavel,
      observacao,
      data,
      status,
      dataInicio,
      dataFim,
    };

    const validationErrors = validarFormularioEmiPed(formData);

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      const response = await emiPedService.create(formData);

      if (response.status !== 201) {
        throw new Error("Erro ao cadastrar EMI PED");
      }

      toast.success("EMI PED cadastrado com sucesso!", {
        position: "bottom-center",
        autoClose: 3000,
        style: { backgroundColor: "#28A745", color: "#fff" },
        progressStyle: { backgroundColor: "#fff" },
      });

      // Limpar os campos após o cadastro
      setMatricula("");
      setNome("");
      setCursoId("");
      setTurma("");
      setTurmaPed("");
      setDisciplina("");
      setTrimestreRecuperar("");
      setDocenteResponsavel("");
      setObservacao("");
      setData("");
      setStatus("criada");
      setDataInicio("");
      setDataFim("");
      setValidationErrors({});
      setError(null);
    } catch (erro) {
      console.error("Erro ao cadastrar EMI PED:", erro);
      setError("Erro ao cadastrar EMI PED. Verifique os dados.");
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastrar EMI PED">
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label htmlFor="matricula">Matrícula:</label>
          <input
            type="text"
            id="matricula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            onBlur={() => handleBlur("matricula", matricula)}
          />
          {validationErrors.matricula && <p className="error">{validationErrors.matricula}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => handleBlur("nome", nome)}
          />
          {validationErrors.nome && <p className="error">{validationErrors.nome}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="curso">Curso:</label>
          <select
            id="curso"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            onBlur={() => handleBlur("curso", cursoId)}
          >
            <option value="">Selecione um curso</option>
            {curso.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
          {validationErrors.curso && <p className="error">{validationErrors.curso}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="turma">Turma:</label>
          <input
            type="text"
            id="turma"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            onBlur={() => handleBlur("turma", turma)}
          />
          {validationErrors.turma && <p className="error">{validationErrors.turma}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="turmaPed">Turma PED:</label>
          <input
            type="text"
            id="turmaPed"
            value={turmaPed}
            onChange={(e) => setTurmaPed(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="disciplina">Disciplina:</label>
          <input
            type="text"
            id="disciplina"
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="trimestreRecuperar">Trimestre a Recuperar:</label>
          <input
            type="text"
            id="trimestreRecuperar"
            value={trimestreRecuperar}
            onChange={(e) => setTrimestreRecuperar(e.target.value)}
          />
          {validationErrors.trimestreRecuperar && <p className="error">{validationErrors.trimestreRecuperar}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="docenteResponsavel">Docente Responsável:</label>
          <input
            type="text"
            id="docenteResponsavel"
            value={docenteResponsavel}
            onChange={(e) => setDocenteResponsavel(e.target.value)}
          />
          {validationErrors.docenteResponsavel && <p className="error">{validationErrors.docenteResponsavel}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="dataInicio">Data Início:</label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="dataFim">Data Fim:</label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="observacao">Observação:</label>
          <textarea
            id="observacao"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <Button tipo="submit" text="Cadastrar Dependencia" className="button-submit" />

      </FormContainer>
    </>
  );
};

export default CadastroEmiPed;
