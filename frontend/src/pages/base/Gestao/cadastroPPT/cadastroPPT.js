import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPPT.css";
import { PPTService } from "../../../../services/emiPptService"
import cursoService from "../../../../services/cursoService";
import { validarFormularioPPT, validarTurmas } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";

const CadastroPPT = () => {
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [turmas, setTurmas] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    curso: "",
    disciplina: "",
    turmaOrigem: "",
    turmaProgressao: "",
    dataInicio: "",
    dataFim: "",
    observacao: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPPT(formData)
    const erroTurmas = validarTurmas(
      turmas.find((turma) => formData.turmaOrigem === turma.id),
      turmas.find((turma) => formData.turmaProgressao === turma.id),
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
          curso: '',
          dataFim: '',
          dataInicio: '',
          disciplina: '',
          observacao: '',
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

  useEffect(() => {
    fetchCursos()
  }, [])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PPT">
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <label className="labelCadastroPPT">
          Aluno
            <Input
              tipo='text'
              nome='aluno'
              onChange={(e) => {
                fetchAlunos(e)
                
                if (opcoesAlunos) {
                  const param = e.target.value
                  console.log(e.target.value)

                  const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || param === aluno.infos_aluno.matricula || param === aluno.email)

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
                  value={aluno.nome || aluno.infos_aluno.matricula || aluno.email}>
                    {aluno.nome || aluno.infos_aluno.matricula || aluno.email}
                </option>
              ))) : (<option>Nenhum aluno encontrado</option>)
            }
          </datalist>
        <section className="sectionCadastroPPT">
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Curso 
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
              Disciplina 
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
              Turma de Origem
              <select className={errors.turmaOrigem ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turmaOrigem: Number(e.target.value)})}
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
              Turma de Progressão
              <select className={errors.turmaProgressao ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                onChange={(e) => setFormData({...formData, turmaProgressao: Number(e.target.value)})}
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
              {errors.datas ? <p style={{color: 'red', fontSize: '10px'}}>{errors.datas}</p> : (<></>)}
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
              {errors.datas ? <p style={{color: 'red', fontSize: '10px'}}>{errors.datas}</p> : (<></>)}
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
