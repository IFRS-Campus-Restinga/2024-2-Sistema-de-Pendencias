import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { validarFormularioCurso, validarCampo } from './validacoes'; 
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input';
import "./CadastroCurso.css";
import Switch from "../../../../components/Switch/Switch";
import { ToastContainer, toast } from "react-toastify";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";
import { useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'

const CadastroCurso = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { cursoId } = location.state || {};  // Pegando o cursoId se presente

  const [modalidade, setModalidade] = useState("Integrado");
  const [opcoesCoordenadores, setOpcoesCoordenadores] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    carga_horaria: '',
    modalidade: modalidade,
    coordenador: '',
    turmas: []
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Carregar dados do curso se estiver editando
  useEffect(() => {
    if (cursoId) {
      cursoService.getCursoById(cursoId)
        .then(response => {
          const curso = response.data;
          setFormData({
            nome: curso.nome,
            carga_horaria: curso.carga_horaria,
            modalidade: curso.modalidade,
            coordenador: curso.coordenador.id,  // Presumindo que o coordenador tenha um ID
            turmas: curso.turmas || []
          });
          setModalidade(curso.modalidade);
        })
        .catch(error => {
          console.error("Erro ao carregar dados do curso para edição:", error);
          toast.error("Erro ao carregar dados do curso.");
        });
    }
  }, [cursoId]);

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);
    setFormData({
      ...formData,
      carga_horaria: '',
      coordenador: '',
      modalidade: novoValor,
      nome: '',
      turmas: []
    });
    formRef.current.reset();
  };

  const addTurma = () => {
    setFormData((prevData) => ({
      ...prevData,
      turmas: [...prevData.turmas, { numero: '' }],
    }));
  };

  const handleTurmaChange = (index, value) => {
    const updatedTurmas = formData.turmas.map((turma, i) =>
      i === index ? { ...turma, numero: value } : turma
    );
    setFormData((prevData) => ({ ...prevData, turmas: updatedTurmas }));
  };

  const removeTurma = (index) => {
    const updatedTurmas = formData.turmas.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, turmas: updatedTurmas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioCurso(formData);

    if (Object.keys(erros).length !== 0) {
      setShowErrorMessage(true);
      setErrors(erros);
    } else {
      try {
        const response = cursoId 
          ? await cursoService.update(cursoId, formData)  // Atualiza curso se estiver editando
          : await cursoService.create(formData);  // Cria curso se for um novo

        if (response.status !== 200 && response.status !== 201) {
          const errorMessage = response.data?.message || 'Erro desconhecido';
          throw new Error(errorMessage);
        }

        // Limpa os campos do formulário e estados de erro
        setFormData({
          nome: '',
          carga_horaria: '',
          modalidade: 'Integrado',
          coordenador: '',
          turmas: []
        });

        setErrors({});
        setShowErrorMessage(false);

        toast.success(cursoId ? "Curso editado com sucesso!" : "Curso cadastrado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        formRef.current.reset();
        if (!cursoId) {
          navigate(`sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`); // Redirecionar após criar o curso
        }
      } catch (erro) {
        toast.error(erro.message, {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });
        console.error('Erro ao cadastrar ou editar curso!', erro);
      }
    }
  };

  const fetchCoordenadores = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Coordenador');
      setOpcoesCoordenadores(res.data);
    } catch (error) {
      console.error('Erro ao buscar coordenadores: ', error);
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
      <FormContainer onSubmit={handleSubmit} titulo={cursoId ? 'Editar Curso' : 'Cadastrar Curso'} comprimento='70%' ref={formRef}>
        {showErrorMessage && <p className="error">* Preencha os campos obrigatórios</p>}

        <div className="modalidade-container">
          <label className="labelCadastroCurso">Modalidade</label>
          <Switch valor={modalidade} valor1='ProEJA' valor2='Integrado' stateHandler={trocaModalidade} />
        </div>

        <div className="input-group">
          <label htmlFor="nome" className="labelCadastroCurso">Nome</label>
          <Input
            tipo="text"
            value={formData.nome}
            erro={errors.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            onBlur={() => handleBlur('nome')}
            textoAjuda='Nome do curso'
          />
          {errors.nome && <p className="error">{errors.nome}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="carga_horaria" className="labelCadastroCurso">Carga Horária</label>
          <Input
            tipo='text'
            value={formData.carga_horaria}
            erro={errors.carga_horaria}
            onChange={(e) => setFormData({ ...formData, carga_horaria: e.target.value })}
            onBlur={() => handleBlur('carga_horaria')}
          />
          {errors.carga_horaria && <p className="error">{errors.carga_horaria}</p>}
        </div>

        <label className="labelCadastroCurso">
          Coordenador
          <Input
            tipo='text'
            nome='coordenador'
            onChange={(e) => {
              fetchCoordenadores(e);

              if (opcoesCoordenadores) {
                const param = e.target.value;
                const coordenador = opcoesCoordenadores.find((coordenador) => param === coordenador.nome || param === coordenador.email);

                if (coordenador) setFormData({ ...formData, coordenador: coordenador.id });
              }
            }}
            onBlur={() => handleBlur('coordenador')}
            erro={errors.coordenador}
            textoAjuda='Insira nome ou email do coordenador'
            lista={'opcoesCoordenadores'}
          />
        </label>
        <datalist className="datalistCadastroCurso" id="opcoesCoordenadores">
          {opcoesCoordenadores ? (opcoesCoordenadores.map((coordenador) => (
            <option className="optionCadastroCurso"
              value={coordenador.nome || coordenador.email}>
              {coordenador.nome || coordenador.email}
            </option>
          ))) : (<option>Nenhum coordenador encontrado</option>)}
        </datalist>
        <br />
        {modalidade === 'Integrado' && (
          <div className="add-turma">
            <button type="button" onClick={addTurma} className="add-button">
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ color: "#006b3f", cursor: "pointer", fontSize: "24px" }}
              />
              <span className="labelCadastroCurso" style={{ color: "black" }}>Adicionar Turma</span>
            </button>
            {formData.turmas.length > 0 && (
              <div className="turmas-lista">
                <table className="tabelaCadastroCurso">
                  <thead className="cabecalhoTabelaCadastroCurso">
                    <tr>
                      <th>Número da Turma</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.turmas.map((turma, index) => (
                      <tr key={index}>
                        <td>
                          <Input
                            tipo='text'
                            value={turma.numero}
                            onChange={(e) => handleTurmaChange(index, e.target.value)}
                            textoAjuda='Digite o número da turma'
                            onBlur={() => handleBlur('turmas')}
                            erro={errors.turmas && errors.turmas[index] ? true : false}
                          />
                          {errors.turmas && errors.turmas[index] && (
                            <p className="error">{errors.turmas[index]}</p>
                          )}
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
          </div>
        )}

        <Button tipo='submit' text={cursoId ? 'Salvar Alterações' : 'Cadastrar Curso'} />
      </FormContainer>
    </>
  );
};

export default CadastroCurso;
