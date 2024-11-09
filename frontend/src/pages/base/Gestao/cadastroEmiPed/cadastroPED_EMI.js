import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import Switch from '../../../../components/Switch/Switch'
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPED_EMI.css";
import { PPTService } from "../../../../services/emiPptService"
import cursoService from "../../../../services/cursoService";
import { validarFormularioPPT, validarTurmas } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";

const CadastroPED = () => {
  const [modalidade, setModalidade] = useState('Integrado')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [turmas, setTurmas] = useState([])
  const [formData, setFormData] = useState({
    aluno: "",
    professor: "",
    curso: "",
    disciplina: "",
    dataInicio: new Date(),
    observacoes: "",
  });
  const [errors, setErrors] = useState({});

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);

    setFormData({
      aluno: "",
      professor: "",
      curso: "",
      disciplina: "",
      dataInicio: new Date(),
      observacoes: "",
      anoSemestreReprov: "",
      turmaOrigem: "",
      serieAnoProgressao: ""
    })
  };

  const serieAnoProgressao = [
    {
      serie: '1º Ano',
      id: 1
    },
    {
      serie: '2º Ano',
      id: 2
    },
    {
      serie: '3º Ano',
      id: 3
    },
    {
      serie: '4º Ano',
      id: 4
    },
  ]

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
        
        toast.success("Dependência cadastrada com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          curso: '',
          dataInicio: new Date(),
          disciplina: '',
          observacoes: '',
          professor: '',
          turmaOrigem: '',
          serieAnoProgressao: ''
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

      const cursosPorModalidade = res.data.filter((curso) => curso.modalidade === modalidade)

      setCursos(cursosPorModalidade)
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
  }, [modalidade])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro PED">
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <span className="spanCadastroPED">
          <p className="pCadastroPED"> 
            Modalidade
          </p>
            <Switch valor1='PROEJA' valor2='Integrado' valor={modalidade} stateHandler={trocaModalidade}/>
        </span>
        <div className="divCadastroPED">
          <label className="labelCadastroPED">
            Aluno
              <Input
                tipo='text'
                nome='aluno'
                onChange={(e) => {
                  fetchAlunos(e)
                  
                  if (opcoesAlunos) {
                    const param = e.target.value
                    console.log(e.target.value)

                    const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.infos_aluno.matricula || aluno.email)

                    if (aluno) setFormData({...formData, aluno: aluno.id})
                  }

                }}
                erro={errors.aluno}
                textoAjuda='Insira nome ou matrícula do aluno'
                lista={'opcoesAlunos'}
              />
            </label>
            <datalist className="datalistCadastroPED" id="opcoesAlunos">
              {
                opcoesAlunos ? (opcoesAlunos.map((aluno) => (
                  <option className="optionCadastroPED" 
                    value={aluno.nome || aluno.infos_aluno.matricula || aluno.email}>
                      {aluno.nome || aluno.infos_aluno.matricula || aluno.email}
                  </option>
                ))) : (<option>Nenhum aluno encontrado</option>)
              }
            </datalist>
          <label className="labelCadastroPED">
            Professor 
            <Input
              tipo='text'
              nome='professor'
              onChange={(e) => {
                fetchProfessores(e)
                
                if (opcoesProfessores) {
                  const param = e.target.value
                  console.log(e.target.value)

                  const professor = opcoesProfessores.find((professor) => param === professor.nome || professor.email)

                  if (professor) setFormData({...formData, professor: professor.id})
                }
              }}
              erro={errors.professor}
              textoAjuda='Insira o email ou nome do professor'
              lista={'opcoesProfessores'}
            />
          </label>
          <datalist className="datalistCadastroPED" id="opcoesProfessores">
            {
              opcoesProfessores ? (opcoesProfessores.map((professor) => (
                <option className="optionCadastroPED"
                  value={professor.nome || professor.email}>
                    {professor.nome || professor.email}
                </option>
              ))) : (<></>)
            }
          </datalist>
        </div>
        <div className="divCadastroPED">
          <input type="checkbox"/>
        </div>
        <section className="sectionCadastroPED">
          <div className="divCadastroPED">
            <label className="labelCadastroPED">
              Curso 
              <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" onChange={(e) => {        
                  setFormData({...formData, curso: Number(e.target.value)})

                  const cursoId = e.target.value;
              
                  const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
              
                  if (curso) {
                    setDisciplinas(curso.disciplinas);
                    setTurmas(curso.turmas);
                  }
                }
              }>
                <option className="optionCadastroPED" value=''>Selecione um curso</option>
                {
                  cursos.map((curso, index) => (
                    <option className="optionCadastroPED" value={curso.id} id={index}>{curso.nome}</option>
                  ))
                }
              </select>
            </label>
            <label className="labelCadastroPED">
              Disciplina 
              <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                onChange={(e) => setFormData({...formData, disciplina: Number(e.target.value)})}
              >
                <option className="optionCadastroPED" value=''>Selecione uma disciplina</option>
                {
                  disciplinas.map((disciplina) => (
                    <option className="optionCadastroPED" value={disciplina.id}>{disciplina.nome}</option>
                  ))
                }
              </select>
            </label>
          </div>
          <div className="divCadastroPED">
            {
              modalidade === 'Integrado' ? (
                <>
                  <label className="labelCadastroPED">
                    Turma do Estudante
                    <select className={errors.turmaOrigem ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, turmaOrigem: Number(e.target.value)})}
                    >
                      <option className="optionCadastroPED" value=''>Selecione uma turma</option>
                      {
                        turmas.map((turma) => (
                          <option className="optionCadastroPED" value={turma.id}>{turma.numero}</option>
                        ))
                      }
                    </select>
                    {errors.turmaOrigem ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turmaOrigem}</p> : (<></>)}
                  </label>
                  <label className="labelCadastroPED">
                    Série/Ano da Progressão
                    <select className={errors.serieAnoProgressao ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, serieAnoProgressao: e.target.value})}
                    >
                      <option className="optionCadastroPED" value=''>Selecione uma turma</option>
                      {
                        serieAnoProgressao.map((serie) => (
                          <option className="optionCadastroPED" value={serie.id}>{serie.serie}</option>
                        ))
                      }
                    </select>
                    {errors.serieAnoProgressao ? <p style={{color: 'red', fontSize: '10px'}}>{errors.serieAnoProgressao}</p> : (<></>)}
                  </label>
                </>
              ) : (
                  <label className="labelCadastroPED">
                    Ano e Semestre de Reprovação
                    <Input
                      tipo='text'
                      textoAjuda='Insira no formato ano/semestre xxxx/x'
                      onChange={(e) => {setFormData({...formData, anoSemestreReprov: e.target.value})}}
                      erro={errors.anoSemestreReprov}
                    />
                    {errors.anoSemestreReprov ? <p style={{color: 'red', fontSize: '10px'}}>{errors.anoSemestreReprov}</p> : (<></>)}
                  </label>
              )
            }
          </div>
        </section>
        <label className="labelCadastroPED">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPED"
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

export default CadastroPED;
