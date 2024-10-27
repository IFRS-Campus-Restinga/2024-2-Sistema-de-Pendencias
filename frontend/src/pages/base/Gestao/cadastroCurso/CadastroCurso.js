import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { validarFormularioCurso, validarCampo } from './validacoes'; // Importa suas funções de validação
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button"
import Input from '../../../../components/Input/Input'
import "./CadastroCurso.css";
import Switch from "../../../../components/Switch/Switch";
import { ToastContainer, toast } from "react-toastify";

const CadastroCurso = () => {
  const [modalidade, setModalidade] = useState("Integrado");
  const [turmas, setTurmas] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    carga_horaria: '',
    modalidade: modalidade,
    turmas: turmas
  })
  const [errors, setErrors] = useState({})
  const [showErrorMessage, setShowErrorMessage] = useState(false)


  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);
  };

  const addTurma = () => {
    setTurmas([...turmas, { numero: "" }]);
    console.log(turmas)
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

    const erros = validarFormularioCurso(formData);

    if (Object.keys(erros).length > 0) {
        setShowErrorMessage(true);
        setErrors(erros);
    } else {
        try {
            const response = await cursoService.create(formData);

            if (response.status !== 201) {
                const errorMessage = response.data?.message || 'Erro desconhecido';
                throw new Error(errorMessage);
            }

            toast.success("Curso cadastrado com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });

            // Limpa os campos do formulário
            setFormData({
                nome: '',
                carga_horaria: '',
                modalidade: 'Integrado', // Corrigido
                turmas: [] // Corrigido
            });

            setErrors({});

        } catch (erro) {
            toast.error("Falha na operação. Tente novamente.", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#d11c28', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });
            console.log('Erro ao cadastrar curso!', erro);
        }
    }
};

  const handleBlur = (campo) => {
    const error = validarCampo(campo, formData[campo]);
    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [campo]: error }));
    } else {
      setErrors((prevErrors) => {
        const { [campo]: removed, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  

  return (
    <>
    <ToastContainer />
    <FormContainer onSubmit={handleSubmit} titulo='Cadastrar Curso'>
      {showErrorMessage ? <p className="error">* Preencha os campos obrigatórios</p> : <></>}
        <div className="modalidade-container">
          <label className="labelCadastroCurso">Modalidade</label>
          <Switch valor={modalidade} valor1='PROEJA' valor2='Integrado' stateHandler={trocaModalidade} />
        </div>
        <div className="input-group">
          <label htmlFor="nome">Nome</label>
          <Input 
            tipo="text"
            value={formData.nome}
            erro={errors.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            onBlur={() => {handleBlur('nome')}}
            textoAjuda='Nome do curso'
          />
          {errors.nome ? <p className="error">{errors.nome}</p> : <></>}
        </div>

        <div className="input-group">
          <label htmlFor="carga_horaria">Carga Horária:</label>
          <Input 
            tipo='text'
            valor={formData.carga_horaria}
            erro={errors.carga_horaria}
            onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
            onBlur={() => {handleBlur('carga_horaria')}}
          />
          {errors.carga_horaria ? <p className="error">{errors.carga_horaria}</p> : <></>}
        </div>

        <div className="add-turma">
          <button type="button" onClick={addTurma} className="add-button">
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={{ color: "#006b3f", cursor: "pointer", fontSize: "24px" }}
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
                      <Input 
                        tipo='text'
                        valor={turma.numero}
                        onChange={(e) => handleTurmaChange(index, e.target.value)}
                        textoAjuda='Digite o número da turma'
                        onBlur={() => {handleBlur('turmas')}}
                        erro={errors.turmas}
                      />
                      {errors.turmas ? <p className="error">{errors.turmas}</p> : <></>}
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
        <Button tipo='submit' text='Cadastrar Curso' />
      </FormContainer>
    </>
  );
};

export default CadastroCurso;
