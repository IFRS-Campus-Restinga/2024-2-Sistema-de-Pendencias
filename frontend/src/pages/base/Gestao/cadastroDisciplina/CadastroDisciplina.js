import React, { useState, useEffect } from 'react';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input';
import {ToastContainer, toast} from 'react-toastify'
import { disciplinaService } from "../../../../services/disciplinaService";
import "./CadastroDisciplina.css";
import { cursoService } from '../../../../services/cursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const CadastroDisciplina = () => {
  const [formData, setFormData] = useState({
    curso: '',
    // disciplinas já cadastradas
    disciplinas: [],
    // disciplinas adicionadas
    novasDisciplinas: [],
  });
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([])
  const [message, setMessage] = useState('');

  // Função para buscar cursos disponíveis
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
    // obtém os cursos cadastrados
    fetchCursos();
    // obtém as disciplinas cadastradas, para caso alguma faça parte de mais de um curso
    fecthDisciplinas(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData); // Log dos dados do formulário
    try {
      const response = await disciplinaService.create(formData); // Envia os dados do formulário
      if (response) {
        setMessage('Disciplina cadastrada com sucesso!');
        setFormData({ curso: '', nome: '', carga_horaria: 0 }); // Reseta o formulário após o sucesso
      }

      if (response.status == 400) throw new Error(response.message)
    } catch (error) {
      console.error('Erro ao cadastrar disciplina!', error.message);
    }
  };

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
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })} // Mantém como string
                  required
                >
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
                <FontAwesomeIcon icon={faPlusCircle} style={{ color: "#006b3f", cursor: "pointer", fontSize: "24px", marginLeft:"10px" }}
            />
              </h3>
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
                      {/* Campo para o Nome da Disciplina */}
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
                          textoAjuda='nome da disciplina'
                        />
                      </td>

                      {/* Campo para a Carga Horária */}
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
                          textoAjuda='Insira um valor entre 1 e 800'
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='divCadastroDisciplina'>
                <h3 className='h3CadastroDisciplina'>Vincular Disciplinas</h3>
                <table className='tabelaCadastroDisciplina'>
                <thead className='cabecalhoCadastroDisciplina'>
                  <tr>
                    <th>Nome</th>
                    <th>Carga Horaria</th>
                  </tr>
                </thead>
                <tbody className='corpoCadastroDisciplina'>
                  {
                    formData.disciplinas.map((disciplina, index) => (
                      <tr>
                        <label className='labelTabelaCadastroDisciplina' htmlFor='vincularDisciplina'>
                          <input type='checkbox' name='vincularDisciplina' hidden/>
                          <td className='celulaCadastroDisciplina'>
                            {disciplina.nome}
                          </td>
                          <td className='celulaCadastroDisciplina'>
                            {disciplina.carga_horaria}
                          </td>
                        </label>
                      </tr>
                    ))
                  }
                </tbody>
                </table>
            </div>
          {message && <div>{message}</div>} {/* Mensagem de sucesso ou erro */}
        </section>
            <div className="ajuste-button">
              <Button
                text="Cadastrar"
                type="submit"
                />
            </div>
      </FormContainer>
    </>
  );
};

export default CadastroDisciplina;
