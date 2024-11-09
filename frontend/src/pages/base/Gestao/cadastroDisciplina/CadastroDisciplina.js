import React, { useState, useEffect } from "react";
import { disciplinaService } from "../../../../services/disciplinaService";
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Input from "../../../../components/Input/Input";
import './CadastroDisciplina.css'

const CadastroDisciplina = () => {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
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

      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar disciplinas", error)
      
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData); // Log dos dados do formulário

    try {
      const response = await disciplinaService.create(formData); // Envia os dados do formulário
      
      if (response.status !== 201) throw new Error(response.response.data.mensagem)

      toast.success("Curso cadastrado com sucesso!", {
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
    } catch (erro) {
      console.error('Erro ao cadastrar disciplina!', erro);

      toast.error('Erro ao cadastrar curso, tente novamente', {
        position: "bottom-center",
        autoClose: 3000,
        style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
        progressStyle: { backgroundColor: '#fff' }
      });
      console.log('Erro ao cadastrar curso!', erro);
    }
  };

  const addDisciplina = () => {
    setFormData((prevData) => ({
      ...prevData,
      novasDisciplinas: [...prevData.novasDisciplinas, { nome: '', carga_horaria: ''}],
    }));
  }

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
  }, []);

  return (
    <>
      <ToastContainer/>
      <FormContainer titulo='Cadastro Disciplina' onSubmit={handleSubmit}>
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
              <div className='containerTabelaCadastroDisciplina'>
                <table className='tabelaCadastroDisciplina'>
                  <thead className='cabecalhoCadastroDisciplina'>
                    <tr>
                      <th>Nome</th>
                      <th>Carga Horaria</th>
                    </tr>
                  </thead>
                  <tbody className="corpoCadastroDisciplina">
                    {formData.novasDisciplinas.map((disciplina, index) => (
                      <tr key={index}>
                        <td className='celulaCadastroDisciplina'>
                          <Input
                            tipo="text"
                            valor={disciplina.nome}
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
                          />
                        </td>
                        <td className='celulaCadastroDisciplina'>
                          <Input
                            tipo="number"
                            valor={disciplina.carga_horaria || ''}
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
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='divCadastroDisciplina'>
              {
                disciplinas.length !== 0 ? (
                  <>
                    <h3 className='h3CadastroDisciplina'>Vincular Disciplinas</h3>
                    <div className='containerDisciplinas'>
                      <span className='cabecalhoDisciplinas'>
                        <div className='colunaDisciplina'>Nome</div>
                        <div className='colunaDisciplina'>Carga Horária</div>
                      </span>
                        {
                          disciplinas.map((disciplina, index) => (
                            <label className='labelContainerDisciplinas' htmlFor={`checkbox-${disciplina.id}`} >
                                <input type='checkbox' className='checkboxDisciplina' id={`checkbox-${disciplina.id}`} value={disciplina.id} onChange={vinculaDisciplina} hidden/>
                                <div className='linhaTabelaDisciplina'>
                                  <p className='textoTabela'>
                                    {disciplina.nome}
                                  </p>
                                  <p className='textoTabela'>
                                    {disciplina.carga_horaria} h
                                  </p>
                                </div>
                            </label>
                          ))
                        }
                    </div>
                  </>
                ) : (
                  <>
                  Não Existem disciplinas cadastradas
                  </>
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
