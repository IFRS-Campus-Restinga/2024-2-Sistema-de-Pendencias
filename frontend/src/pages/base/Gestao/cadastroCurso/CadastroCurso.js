import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { validarFormularioCurso } from './validacoes'; // Importa suas funções de validação
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button"
import "./CadastroCurso.css";
import Switch from "../../../../components/Switch/Switch";
import { ToastContainer, toast } from "react-toastify";

const CadastroCurso = () => {
  const [nome, setNome] = useState("");
  const [carga_horaria, setCargaHoraria] = useState("");
  const [modalidade, setModalidade] = useState("Integrado");
  const [turmas, setTurmas] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [error, setError] = useState(null);

  const trocaModalidade = (novoValor) => {
    console.log(novoValor)
    setModalidade(novoValor);
  };

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
      carga_horaria,
      modalidade,
      turmas,
    };

    try {
      // Valide os dados do formulário
      const erros = validarFormularioCurso(formData);

      if (Object.keys(erros).length > 0) {
        setError(erros);
        throw new Error()
      }

      const response = await cursoService.create(formData)

      console.log(response.status)

      if (response.status === 400) throw new Error(response.status)
      
      toast.success("Curso cadastrado com sucesso!", {
        position: "bottom-center",
        autoClose: 3000,
        style: { backgroundColor: '#28A745', color: '#fff' },
        progressStyle: { backgroundColor: '#fff' }
      });

      // limpa os campos do formulário
      setNome("");
      setCargaHoraria("");
      setModalidade("");
      setTurmas([]);

      // limpa os erros
      setError(null);

    } catch (erro) {
      console.log(`Erro ao cadastrar curso: ${erro}`)
    }
  };

  return (
    <>
    <ToastContainer />
    <FormContainer onSubmit={handleSubmit} titulo='Cadastrar Curso'>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      {error && <p className="error">{error.global || "Verifique os campos."}</p>} {/* Mensagem de erro global */}

        <div className="modalidade-container">
        <label className="labelCadastroCurso">Modalidade</label>
          <Switch valor={modalidade} valor1='PROEJA' valor2='Integrado' stateHandler={trocaModalidade}/>
        </div>
  
        <div className="input-group">
          <label htmlFor="nome">Nome Do Curso:</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={nome}
            className={error && error.nome ? 'error-input' : ''}
            onChange={(e) => setNome(e.target.value)}
          />
          {error && error.nome && <p className="error">{error.nome}</p>}
        </div>
  
        <div className="input-group">
          <label htmlFor="carga_horaria">Carga Horária:</label>
          <input
            type="text"
            name="carga_horaria"
            id="carga_horaria"
            value={carga_horaria}
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
            <span className="labelCadastroCurso" style={{ color: "black" }}>Adicionar Turma</span>
          </button>
        </div>
  
        {turmas.length > 0 && (
          <div className="turmas-lista">
            <table className="turmas-tabela">
              <thead className="cabecalhoTabelaCadastroCurso">
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
      <Button tipo='submit' text='Cadastrar Curso'/>        
      </FormContainer>
    </>
  );
};

export default CadastroCurso;
