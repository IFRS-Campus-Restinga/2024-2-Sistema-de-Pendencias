import React, { useState, useEffect, useRef } from "react";
import { disciplinaService } from "../../../../services/disciplinaService";
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../../../components/Input/Input";
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS'
import loading from '../../../../assets/loading-disciplinas.png'
import { validarCampo, validarFormularioDisciplina } from "./validacoes";
import './CadastroDisciplina.css'

const CadastroDisciplina = () => {
  const formRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [cursos, setCursos] = useState([]);
  const [errors, setErrors] = useState({});
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    curso: '',
    novasDisciplinas: [],
    disciplinas: [],
  })


  const fetchCursos = async () => {
    try {
      const response = await cursoService.list()

      if (response.status !== 200) throw new Error(response.data.mensagem)

      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos!', error);

    }
  };

  const fetchDisciplinas = async () => {
    try {
      const response = await disciplinaService.list()

      if (response.status !== 200) throw new Error(response.data.mensagem)

      setDisciplinas(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar disciplinas", error)
      
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioDisciplina(formData)
    
    if(erros.curso === '' && erros.novasDisciplinas.some((erro) => Object.keys(erro).length !== 0)) {
      setErrors(erros)
    } else {
      try {
        const response = await disciplinaService.create(formData); // Envia os dados do formulário
        
        if (response.status !== 201) throw new Error(response.response.data.mensagem)
  
        toast.success("Disciplinas cadastradas e vinculadas ao curso com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' }
        });
  
        setFormData({
          curso: '',
          disciplinas: [],
          novasDisciplinas: []
        })

        formRef.current.reset()

        setErrors({})
      } catch (erro) {
        console.error('Erro ao cadastrar disciplina!', erro);
  
        toast.error('Erro ao cadastrar curso, tente novamente', {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });
      }
    };
  }

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

  const addDisciplina = () => {
    setFormData((prevData) => ({
      ...prevData,
      novasDisciplinas: [...prevData.novasDisciplinas, { nome: '', carga_horaria: ''}],
    }));
  }

  const removeDisciplina = (index) => {
    const disciplinas = formData.novasDisciplinas.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, novasDisciplinas: disciplinas }));
  };

  const vinculaDisciplina = (e) => {
    const disciplinaId = e.target.value;

    setFormData((prevData) => {
        const disciplinaExists = prevData.disciplinas.some(d => d.id === disciplinaId);

        if (disciplinaExists) {
            return {
                ...prevData,
                disciplinas: prevData.disciplinas.filter(d => d.id !== disciplinaId)
            };
        } else {
            return {
                ...prevData,
                disciplinas: [...prevData.disciplinas, disciplinaId]
            };
        }
    });
  }

  useEffect(() => {
    fetchCursos();
    fetchDisciplinas()
  }, [formData]);

  return (
    <>
      <ToastContainer/>
      <FormContainer titulo='Cadastro Disciplina' onSubmit={handleSubmit} comprimento='80%' ref={formRef}>
        <span className='spanCadastroCurso'>
          <label htmlFor="curso" className='labelCadastroDisciplina'>
            Curso
          </label>
          <select
            className='selectCadastroDisciplina'
            value={formData.curso}
            onChange={(e) => {
              setFormData({ ...formData, curso: e.target.value })
            }}
            onBlur={() => handleBlur('curso')}
            required
          >
            <option className='optionCadastroDisciplina' value={''}>Selecione um curso</option>
            {cursos.map((curso) => (
              <option className='optionCadastroDisciplina' key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </span>
        <section className='sectionCadastroDisciplina'>
            <div className='divCadastroDisciplina'>
              <h3 className='h3CadastroDisciplina'>
                Inserir Disciplinas
                <button type='button' className='buttonCadastroDisciplina' onClick={addDisciplina}>
                  <FontAwesomeIcon icon={faPlusCircle} style={{ color: "#006b3f", cursor: "pointer", fontSize: "24px", marginLeft:"10px" }}/>
                </button>
              </h3>
              <div className='containerTabelaDisciplinas'>
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Carga Horaria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.novasDisciplinas.map((disciplina, index) => (
                      <tr key={index}>
                        <td>
                          <Input
                            tipo="text"
                            valor={disciplina.nome}
                            onBlur={() => handleBlur('novaDisciplina')}
                            onChange={(e) => {
                              const novoNome = e.target.value;
                              setFormData((prevData) => {
                                const novasDisciplinas = [...prevData.novasDisciplinas];
                                novasDisciplinas[index] = {
                                  ...novasDisciplinas[index],
                                  nome: novoNome,
                                };
                                return { ...prevData, novasDisciplinas };
                              });
                            }}
                            erro={errors?.novasDisciplinas?.[index]?.nome}
                          />
                        </td>
                        <td>
                          <div className="divTabela">
                            <Input
                              tipo="number"
                              valor={disciplina.carga_horaria}
                              onBlur={() => {handleBlur('novaDisciplina')}}
                              onChange={(e) => {
                                const novaCargaHoraria = e.target.value;
                                setFormData((prevData) => {
                                  const novasDisciplinas = [...prevData.novasDisciplinas];
                                  novasDisciplinas[index] = {
                                    ...novasDisciplinas[index],
                                    carga_horaria: novaCargaHoraria,
                                  };
                                  return { ...prevData, novasDisciplinas };
                                });
                              }}
                              erro={errors?.novasDisciplinas?.[index]?.carga_horaria}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ cursor: "pointer", color: "red", fontSize: "20px", marginLeft: '10px' }}
                              onClick={() => removeDisciplina(index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='divCadastroDisciplina'>
              <h3 className='h3CadastroDisciplina'>Vincular Disciplinas</h3>
              {
                isLoading ? (
                  <LoadingIFRS icone={loading}/>
                ) : (
                  disciplinas.length !== 0 ? (
                    <div className='containerTabelaDisciplinas'>
                      <table>
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Carga Horária</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            disciplinas.map((disciplina) => (
                              <tr>
                                <td>
                                  <div className="divTabela">
                                    <input type='checkbox' className='checkboxDisciplina' id={`checkbox-${disciplina.id}`} value={disciplina.id} onChange={vinculaDisciplina} hidden/>
                                    <label className='labelContainerDisciplinas' htmlFor={`checkbox-${disciplina.id}`} >
                                    </label>
                                      <p className="pDisciplina">{disciplina.nome}</p>
                                  </div>
                                </td>
                                <td>{disciplina.carga_horaria}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <>
                    Não Existem disciplinas cadastradas
                    </>
                  )
                )
              }
            </div>
        </section>
              <Button
                text="Cadastrar"
                tipo="submit"
              />
      </FormContainer>
    </>
  );
};

export default CadastroDisciplina;
