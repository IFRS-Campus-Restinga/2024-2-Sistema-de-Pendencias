import React, { useEffect, useRef, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPPT.css";
import { PPTService } from "../../../../services/emiPptService"
import {cursoService} from "../../../../services/cursoService";
import { validarFormularioPPT, validarTurmas } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";

const CadastroPPT = () => {
  const formRef = useRef()
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [turmas, setTurmas] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    professor_disciplina: "",
    professor_ppt: "",
    curso: "",
    disciplina: "",
    turma_origem: "",
    turma_progressao: "",
    observacao: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({})

    const erros = validarFormularioPPT(formData)
    const erroTurmas = validarTurmas(
      turmas.find((turma) => formData.turma_origem === turma.id),
      turmas.find((turma) => formData.turma_progressao === turma.id),
    )

    if (Object.keys(erros).length !== 0 || erroTurmas) {
      erros.turmas = erroTurmas
      setErrors(erros)
    } else {
      try {
        const res = await PPTService.create(formData)

        if (res.status !== 201) throw new Error(res.response.data.mensagem)
        
        toast.success("Progressão em Turma cadastrada com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          professor_disciplina: '',
          professor_ppt: '',
          curso: '',
          disciplina: '',
          observacao: '',
          turma_origem: '',
          turma_progressao: ''
        })

        formRef.current.reset()

        setErrors({})
      } catch (error) {
        console.error('Erro ao cadastrar dependência: ', error)

      }
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await cursoService.porModalidade('Integrado')
      
      setCursos(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAlunos = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Aluno')

      setOpcoesAlunos(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProfessores = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, 'Professor')

      setOpcoesProfessores(res.data)
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
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PPT" ref={formRef}>
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <label className="labelCadastroPPT">
          Aluno *
            <Input
              type='text'
              name='aluno'
              onChange={(e) => {
                fetchAlunos(e)
                
                if (opcoesAlunos) {
                  const param = e.target.value
                  console.log(e.target.value)

                  const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || param === aluno?.matricula || param === aluno.email)

                  if (aluno) setFormData({...formData, aluno: aluno.id})
                }
              }}
              erro={errors.aluno}
              textoAjuda='Insira nome ou matrícula do aluno'
              lista={'opcoesAlunos'}
            />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesAlunos">
          {
            opcoesAlunos ? (opcoesAlunos.map((aluno) => (
              <option className="optionCadastroPPT" 
                value={aluno.nome || aluno?.matricula || aluno.email}>
                  {aluno.nome || aluno?.matricula || aluno.email}
              </option>
            ))) : (<option>Nenhum aluno encontrado</option>)
          }
        </datalist>
        <label className="labelCadastroPPT">
          Docente Responsável pela Progressão *
          <Input
            tipo='text'
            nome='professor'
            onChange={(e) => {
              fetchProfessores(e)
              
              if (opcoesProfessores) {
                const param = e.target.value
                console.log(e.target.value)

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({...formData, professor_ppt: professor.id})
              }
            }}
            erro={errors.professor_ppt}
            textoAjuda='Insira o email ou nome do professor'
            lista={'opcoesProfessores'}
          />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesProfessores">
          {
            opcoesProfessores ? (opcoesProfessores.map((professor) => (
              <option className="optionCadastroPPT"
                value={professor.nome || professor.email}>
                  {professor.nome || professor.email}
              </option>
            ))) : (<></>)
          }
        </datalist>
        <label className="labelCadastroPPT">
          Docente que ministrou a disciplina *
          <Input
            tipo='text'
            nome='professor'
            onChange={(e) => {
              fetchProfessores(e)
              
              if (opcoesProfessores) {
                const param = e.target.value
                console.log(e.target.value)

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({...formData, professor_disciplina: professor.id})
              }
            }}
            erro={errors.professor_disciplina}
            textoAjuda='Insira o email ou nome do professor'
            lista={'opcoesProfessores'}
          />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesProfessores">
          {
            opcoesProfessores ? (opcoesProfessores.map((professor) => (
              <option className="optionCadastroPPT"
                value={professor.nome || professor.email}>
                  {professor.nome || professor.email}
              </option>
            ))) : (<></>)
          }
        </datalist>
        <section className="sectionCadastroPPT">
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Curso *
              <select className={errors.curso ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'} name="curso" onChange={(e) => {        
                  setFormData({...formData, curso: Number(e.target.value)})

                  const cursoId = e.target.value;
              
                  const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
              
                  if (curso) {
                    setDisciplinas(curso.disciplinas);
                    setTurmas(curso.turmas);
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
              Disciplina *
              <select className={errors.disciplina ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, disciplina: Number(e.target.value)})}
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
              Turma de Origem *
              <select className={errors.turmaOrigem ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turma_origem: Number(e.target.value)})}
              >
                <option className="optionCadastroPPT" value=''>Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
              {errors.turmas ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turmas}</p> : (<></>)}
            </label>
            <label className="labelCadastroPPT">
              Turma de Progressão *
              <select className={errors.turmaProgressao ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turma_progressao: Number(e.target.value)})}
              >
                <option className="optionCadastroPPT" value=''>Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
              {errors.turmas ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turmas}</p> : (<></>)}
            </label>
          </div>
        </section>
        <label className="labelCadastroPPT">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPPT"
            onChange={(e) => setFormData({...formData, observacao: e.target.value})}
            name="observacoes"
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button color="#006b3f" text="Cadastrar" tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
