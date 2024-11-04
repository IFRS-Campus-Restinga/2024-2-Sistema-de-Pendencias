import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPPT.css";
import { PPTService } from "../../../../services/emiPptService"
import cursoService from "../../../../services/cursoService";
import { validarFormularioPPT } from "./validacoes";

const CadastroPPT = () => {
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    professor: "",
    curso: "",
    disciplina: "",
    turmaOrigem: "",
    turmaProgressao: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationErrors = validateForm();
    // setErrors(validationErrors);

    const erros = validarFormularioPPT(formData)

    if (Object.keys(erros).length !== 0) {
      setErrors(erros)
    } else {
      try {
        const res = await PPTService.create(formData)

        if (res.status !== 201) throw new Error(res.response.data.mensagem)
        
        toast.success("Dependência cadastrada com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          curso: '',
          dataFim: '',
          dataInicio: '',
          disciplina: '',
          observacoes: '',
          professor: '',
          turmaOrigem: '',
          turmaProgressao: ''
        })

        setErrors({})
      } catch (error) {
        console.error('Erro ao cadastrar dependência: ', error)

      }
    }
  };

    const fetchCursos = async () => {
      try {
        const res = await cursoService.list()
        
        setCursos(res.data)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    fetchCursos()
  }, [])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PPT">
        {errors == {} ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <label className="labelCadastroPPT">
          Aluno
          <span className="spanCadastroPPT">
            <Input
              tipo='text'
              nome='aluno'
              onChange={(e) => setFormData({...formData, aluno: `${e.target.value}@aluno.restinga.ifrs.edu.br`})}
              erro={errors.aluno}
              textoAjuda='Insira a matrícula do aluno'
            />
            <p className="pCadastroPPT">
              @aluno.restinga.ifrs.edu.br
            </p>
          </span>
        </label>
        <label className="labelCadastroPPT">
          Professor 
          <Input
            tipo='email'
            nome='professor'
            onChange={(e) => setFormData({...formData, professor: e.target.value})}
            erro={errors.professor}
            textoAjuda='Insira o email do professor'
          />
        </label>
        <section className="sectionCadastroPPT">
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Curso 
              <select className={errors.curso ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'} name="curso" onChange={(e) => {        
                  setFormData({...formData, curso: e.target.value})
                  const selectedCursoId = e.target.value; // Obtém o ID do curso selecionado
              
                  const selectedCurso = cursos.find(curso => curso.id === Number(selectedCursoId)); // Encontra o curso correspondente
              
                  if (selectedCurso) {
                    setDisciplinas(selectedCurso.disciplinas); // Define as disciplinas do curso selecionado
                    setTurmas(selectedCurso.turmas); // Define as turmas do curso selecionado
                  }
                }
              }>
                <option className="optionCadastroPPT" value=''>Selecione um curso</option>
                {
                  cursos.map((curso, index) => (
                    <option className="optionCadastroPPT" value={curso.id} id={index}>{curso.nome}</option>
                  ))
                }
              </select>
            </label>
            <label className="labelCadastroPPT">
              Disciplina 
              <select className={errors.disciplina ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, disciplina: e.target.value})}
              >
                <option className="optionCadastroPPT" value=''>Selecione uma disciplina</option>
                {
                  disciplinas.map((disciplina) => (
                    <option className="optionCadastroPPT" value={disciplina.id}>{disciplina.nome}</option>
                  ))
                }
              </select>
            </label>
          </div>
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Turma de Origem
              <select className={errors.turmaOrigem ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turmaOrigem: e.target.value})}
              >
                <option className="optionCadastroPPT" value=''>Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
            </label>
            <label className="labelCadastroPPT">
              Turma de Progressão
              <select className={errors.turmaProgressao ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turmaProgressao: e.target.value})}
              >
                <option className="optionCadastroPPT" value=''>Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
            </label>
          </div>
        </section>
        <section className="sectionCadastroPPT">
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Data Inicial
              <Input
                tipo='date'
                nome='dataInicio'
                onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                erro={errors.dataInicio}
                dataMinima={new Date().toISOString().split('T')[0]}
              />
            </label>
          </div>
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Data Final
              <Input
                tipo='date'
                nome='dataFinal'
                onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                erro={errors.dataFim}
                dataMinima={new Date().toISOString().split('T')[0]}
              />
            </label>
          </div>
        </section>
        <label className="labelCadastroPPT">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPPT"
            onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
            name="observacoes"
            value={formData.observacoes}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button color="#006b3f" text="Cadastrar" tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
