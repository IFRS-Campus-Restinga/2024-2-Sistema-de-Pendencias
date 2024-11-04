import React, { useState, useEffect } from "react";
import { disciplinaService } from "../../../../services/disciplinaService";
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { validarFormularioDisciplina, validarCampo } from "./validacoes";
import "./CadastroDisciplina.css";

const CadastroDisciplina = () => {
  const [name, setName] = useState("");
  const [carga_horaria, setCargaHoraria] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});


  const fetchCursos = async () => {
    try {
      const response = await cursoService.list()

      if (response.status !== 200) throw new Error(response.data.mensagem)

      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos!', error);

    }
  };

  const fecthDisciplinas = async () => {
    try {
      const response = await disciplinaService.list()

      if (response.status !== 200) throw new Error(response.data.mensagem)

      setDisciplinas(response.data)
    } catch (error) {
      console.error("Erro ao buscar disciplinas", error)
      
    }
  }

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
      name,
      carga_horaria,
      curso: cursoId,
    };

    const validationErrors = validarFormularioDisciplina(formData);

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      console.log("Dados enviados:", formData);

      const response = await disciplinaService.create(formData);

      if (response.status !== 201) {
        throw new Error("Erro ao cadastrar disciplina");
      }

      toast.success("Disciplina cadastrada com sucesso!", {
        position: "bottom-center",
        autoClose: 3000,
        style: { backgroundColor: "#28A745", color: "#fff" },
        progressStyle: { backgroundColor: "#fff" },
      });

      setName("");
      setCargaHoraria("");
      setCursoId("");
      setValidationErrors({});
      setError(null);
    } catch (erro) {
      console.error("Erro ao cadastrar disciplina:", erro);
      setError("Erro ao cadastrar disciplina. Verifique os dados.");
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastrar Disciplina">
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label htmlFor="curso">Selecionar Curso:</label>
          <select
            id="curso"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            onBlur={() => handleBlur("curso", cursoId)}
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
          {validationErrors.curso && <p className="error">{validationErrors.curso}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="name">Nome da Disciplina:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name", name)}
          />
          {validationErrors.name && <p className="error">{validationErrors.name}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="carga_horaria">Carga Horária:</label>
          <input
            type="number"
            id="carga_horaria"
            value={carga_horaria}
            onChange={(e) => setCargaHoraria(e.target.value)}
            onBlur={() => handleBlur("carga_horaria", carga_horaria)}
          />
          {validationErrors.carga_horaria && <p className="error">{validationErrors.carga_horaria}</p>}
        </div>

        <Button tipo="submit" text="Cadastrar Disciplina" />
      </FormContainer>
    </>
  );
};

export default CadastroDisciplina;
