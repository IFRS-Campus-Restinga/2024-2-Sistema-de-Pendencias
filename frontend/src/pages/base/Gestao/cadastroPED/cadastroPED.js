import React, { useEffect, useState, useRef } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import Switch from '../../../../components/Switch/Switch'
import { ToastContainer, toast } from 'react-toastify'
import "./cadastroPED.css";
import cursoService from "../../../../services/cursoService";
import { validarFormularioPED, validarSerieTurma } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";
import { PEDService } from "../../../../services/pedService";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faLock } from "@fortawesome/free-solid-svg-icons";

const CadastroPED = () => {
  const formRef = useRef()
  const location = useLocation()
  const {state} = location.state || {}
  const [modalidade, setModalidade] = useState(state?.serie_progressao ? 'Integrado' : 'ProEJA' || 'Integrado')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    aluno_id: '',
    professor_ped_id: '',
    professor_disciplina_id: '',
    curso_id: '',
    disciplina_id: '',
    turma_origem_id: '',
    serie_progressao: '',
    trimestre_recuperar: '',
    observacao: '',
  });

  const serieProgressao = ['1º Ano', '2º Ano','3º Ano','4º Ano']

  // função para adicionar/remover trimestres do campo trimestre rec no form PED Integrado 
  const handleTrimestreRec = (e) => {
    const { checked, value } = e.target;
    let novoTrimestre = formData.trimestre_recuperar.split(', ');

    if (checked) {
        if (!novoTrimestre.includes(value)) {
            novoTrimestre.push(value);
        }
    } else {
        novoTrimestre = novoTrimestre.filter(item => item !== value);
    }
    novoTrimestre = novoTrimestre.filter(item => item.trim() !== '');

    novoTrimestre.sort();

    setFormData({
        ...formData,
        trimestre_recuperar: novoTrimestre.join(', '),
    });
  };

  const verificaTrimestres = (trimestre) => {
    if (state.trimestre_recuperar) {
      if (state.trimestre_recuperar.includes(trimestre)) return true
    }

    return false
  }

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);

    if (novoValor === 'Integrado') {
      setFormData({
        aluno_id: '',
        professor_ped_id: '',
        professor_disciplina_id: '',
        curso_id: '',
        disciplina_id: '',
        turma_origem_id: '',
        serie_progressao: '',
        trimestre_recuperar: '',
        observacao: '',
      })
    } else {
      setFormData({
        aluno_id: '',
        professor_ped_id: '',
        professor_disciplina_id: '',
        curso_id: '',
        disciplina_id: '',
        ano_semestre_reprov: '',
        observacao: ''
      })
    }

    state = {}

    setErrors({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPED(formData, modalidade)

    if (modalidade === 'Integrado') {
      const erroTurma = validarSerieTurma(formData.serie_progressao, turmas.find((turma) => turma.id === formData.turma_origem_id))

      if (erroTurma) erros.turma_serie = erroTurma
    }
    
    if (Object.keys(erros).length !== 0) {
      console.log(erros)
      setErrors(erros)
    } else {
      try {
        if (modalidade === 'Integrado') {
          const res = await PEDService.create_EMI(formData)

          if (res.status !== 201) throw new Error(res)
        } else {
          const res = await PEDService.create_ProEJA(formData)

          if (res.status !== 201) throw new Error(res)
        }
      
        toast.success("Dependência cadastrada com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno_id: '',
          professor_ped_id: '',
          professor_disciplina_id: '',
          curso_id: '',
          disciplina_id: '',
          turma_origem_id: '',
          serie_progressao: '',
          trimestre_recuperar: '',
          observacao: '',
          ano_semestre_reprov: '',
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

  const fetchPED = async (pedId) => {
    try {
      const res = await PEDService.porId(pedId)

      if (res.status !== 200) throw new Error(res)

      setFormData(res.data)
    } catch (error) {
      console.error(error)
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
    if (state) {
      fetchPED(state.id)
    }

    console.log(state)

    fetchCursos()
  }, [modalidade])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo={state ? 'Editar PED' : 'Cadastro PED'} ref={formRef}>
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <span className="spanCadastroPED">
          <p className="pCadastroPED"> 
            Modalidade
          </p>
            <Switch 
              valor1='ProEJA' 
              valor2='Integrado' 
              valor={modalidade} 
              stateHandler={state ? null : trocaModalidade}
              imagemCustom={state ? <FontAwesomeIcon icon={faLock} size="xl" color={modalidade === 'Integrado' ? '#006b3f' : '#fff'}/> : <></>}
            />
        </span>
        {
          modalidade === 'Integrado' ? (
            <>
              <section className='sectionCadastroPED'>
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Aluno *
                      <Input
                        tipo='text'
                        nome='aluno'
                        valor={state?.aluno || ''}
                        onChange={(e) => {
                          fetchAlunos(e)
                          
                          if (opcoesAlunos) {
                            const param = e.target.value
                            console.log(e.target.value)
          
                            const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.matricula|| aluno.email)
          
                            if (aluno) setFormData({...formData, aluno_id: aluno.id})
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
                          value={aluno.nome || aluno.matricula || aluno.email}>
                            {aluno.nome || aluno.matricula || aluno.email}
                        </option>
                      ))) : (<option>Nenhum aluno encontrado</option>)
                    }
                  </datalist>
                  <label className="labelCadastroPED">
                    Docente Responsável pela Progressão *
                    <Input
                      tipo='text'
                      nome='professor'
                      valor={state?.professor_ped || ''}
                      onChange={(e) => {
                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)
          
                          const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
          
                          if (professor) setFormData({...formData, professor_ped_id: professor.id})
                        }
                      }}
                      erro={errors.professor_ped}
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
                  <label className="labelCadastroPED">
                    Docente que ministrou a disciplina *
                    <Input
                      tipo='text'
                      nome='professor'
                      valor={state?.professor_disciplina || ''}
                      onChange={(e) => {
                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)
          
                          const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
          
                          if (professor) setFormData({...formData, professor_disciplina_id: professor.id})
                        }
                      }}
                      erro={errors.professor_disciplina}
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
                    <label className="labelCadastroPED">
                      Trimestres a Recuperar *
                      {errors.trimestre_recuperar ? <p style={{color: 'red', fontSize: '10px'}}>{errors.trimestre_recuperar}</p> : (<></>)}
                      <div className="divTrimestreRec">
                        <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('1º')} value='1º' id="1" hidden/>
                        <label className="labelTrimestreRec" htmlFor="1">1º Trimestre</label>
                        <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('2º')} value='2º' id="2" hidden/>
                        <label className="labelTrimestreRec" htmlFor="2">2º Trimestre</label>
                        <input className="checkboxTrimestre" onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('3º')} value='3º' id='3' hidden/>
                        <label className="labelTrimestreRec" htmlFor="3">3º Trimestre</label>
                      </div>
                    </label>
                </div>
              </section>
              <section className="sectionCadastroPED">
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Curso *
                    <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" onChange={(e) => {        
                        setFormData({...formData, curso_id: Number(e.target.value)})

                        const cursoId = e.target.value;
                    
                        const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                    
                        if (curso) {
                          setDisciplinas(curso.disciplinas);
                          setTurmas(curso.turmas)
                        }
                      }
                    }>
                      <option className="optionCadastroPED" value=''>{state.curso ? state.curso : 'Selecione um curso'}</option>
                      {
                        cursos.map((curso, index) => (
                          <option className="optionCadastroPED" value={curso.id} id={index}>{curso.nome}</option>
                        ))
                      }
                    </select>
                  </label>
                  <label className="labelCadastroPED">
                    Disciplina *
                    <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      onChange={(e) => setFormData({...formData, disciplina_id: Number(e.target.value)})}
                    >
                      <option className="optionCadastroPED" value=''>{state.disciplina ? state.disciplina : 'Selecione uma disciplina'}</option>
                      {
                        disciplinas.map((disciplina) => (
                          <option className="optionCadastroPED" value={disciplina.id}>{disciplina.nome}</option>
                        ))
                      }
                    </select>
                  </label>
                </div>
                <div className="divCadastroPED">
                <label className="labelCadastroPED">
                  Série da Progressão *
                  <select
                    className={errors.serie_progressao || errors.turma_serie ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                    onChange={(e) => setFormData({ ...formData, serie_progressao: e.target.value })}
                  >
                    <option value="">{state.serie_progressao ? state.serie_progressao : 'Selecione a série/ano da progressão'}</option>
                    {serieProgressao.map((serie, index) => (
                      <option key={index} value={serie}>
                        {serie}
                      </option>
                    ))}
                  </select>
                  {errors.turma_serie ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turma_serie}</p> : <></>}
                </label>
                <label className="labelCadastroPED">
                  Turma Origem *
                  <select
                    className={errors.turma_origem || errors.turma_serie ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                    onChange={(e) => setFormData({ ...formData, turma_origem_id: Number(e.target.value) })}
                  >
                    <option value="">{state.turma_origem ? state.turma_origem : 'Selecione a turma de origem'}</option>
                    {turmas.map((turma, index) => (
                      <option key={index} value={turma.id}>
                        {turma.numero}
                      </option>
                    ))}
                  </select>
                  {errors.turma_serie ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turma_serie}</p> : <></>}
                </label>
                </div>
              </section>
            </>
          ) : (
            <>
              <label className="labelCadastroPED">
              Aluno *
                <Input
                  tipo='text'
                  nome='aluno'
                  valor={state.aluno || ''}
                  onChange={(e) => {
                    fetchAlunos(e)
                    
                    if (opcoesAlunos) {
                      const param = e.target.value
                      console.log(e.target.value)
    
                      const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.matricula || aluno.email)
    
                      if (aluno) setFormData({...formData, aluno_id: aluno.id})
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
                      value={aluno.nome || aluno.matricula || aluno.email}>
                        {aluno.nome || aluno.matricula || aluno.email}
                    </option>
                  ))) : (<option>Nenhum aluno encontrado</option>)
                }
              </datalist>
              <label className="labelCadastroPED">
                    Docente Responsável pela Progressão *
                    <Input
                      tipo='text'
                      nome='professor'
                      valor={state.professor_ped || ''}
                      onChange={(e) => {
                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)
          
                          const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
          
                          if (professor) setFormData({...formData, professor_ped_id: professor.id})
                        }
                      }}
                      erro={errors.professor_ped}
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
              <label className="labelCadastroPED">
                Docente que ministrou a disciplina *
                <Input
                  tipo='text'
                  nome='professor'
                  valor={state.professor_disciplina || ''}
                  onChange={(e) => {
                    fetchProfessores(e)
                    
                    if (opcoesProfessores) {
                      const param = e.target.value
                      console.log(e.target.value)
      
                      const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
      
                      if (professor) setFormData({...formData, professor_disciplina_id: professor.id})
                    }
                  }}
                  erro={errors.professor_disciplina}
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
              <label className="labelCadastroPED">
                Curso *
                <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" onChange={(e) => {        
                    setFormData({...formData, curso_id: Number(e.target.value)})

                    const cursoId = e.target.value;
                
                    const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                
                    if (curso) {
                      setDisciplinas(curso.disciplinas);
                    }
                  }
                }>
                      <option className="optionCadastroPED" value=''>{state.curso ? state.curso : 'Selecione um curso'}</option>
                      {
                    cursos.map((curso, index) => (
                      <option className="optionCadastroPED" value={curso.id} id={index}>{curso.nome}</option>
                    ))
                  }
                </select>
              </label>
              <label className="labelCadastroPED">
                Disciplina *
                <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                  onChange={(e) => setFormData({...formData, disciplina_id: Number(e.target.value)})}
                >
                      <option className="optionCadastroPED" value=''>{state.disciplina ? state.disciplina : 'Selecione uma disciplina'}</option>
                      {
                    disciplinas.map((disciplina) => (
                      <option className="optionCadastroPED" value={disciplina.id}>{disciplina.nome}</option>
                    ))
                  }
                </select>
              </label>
              <label className="labelCadastroPED">
                Ano/Semestre de Reprovação *
                <Input
                  type='text'
                  onChange={(e) => setFormData({...formData, ano_semestre_reprov: e.target.value})}
                  valor={state.ano_semestre_reprov || ''}
                  erro={errors.ano_semestre_reprov}
                  textoAjuda='Insira no formato Ano/Semestre - xxxx/x'
                />
              </label>
            </>
          )
        }
        <label className="labelCadastroPED">
          Observação (opcional)
          <textarea
            className="textAreaCadastroPED"
            onChange={(e) => setFormData({...formData, observacao: e.target.value})}
            name="observacao"
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <div className="containerBotoes" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap'}}>
          <Button color="#006b3f" text={state ? 'Salvar Alterações' : 'Cadastrar'} tipo="submit" />
          {
            state ? (
              <>
                <Link to={'planoEstudos'}>
                  <Button color="#006b3f" text='Plano de Estudos'/>
                </Link>
                <Link to={'formEnceramento'}>
                  <Button color="#006b3f" text='Formulário de Encerramento'/>
                </Link>
              </>
            ) : (
              <></>
            )
          }
        </div>
      </FormContainer>
    </>
  );
};

export default CadastroPED;
