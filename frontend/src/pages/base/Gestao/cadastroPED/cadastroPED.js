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
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { calendarioAcademicoService } from "../../../../services/calendarioAcademicoService";

const CadastroPED = () => {
  const location = useLocation()
  const {state} = location || {}
  const [modalidade, setModalidade] = useState(state ? state.serie_progressao ? 'Integrado' : 'ProEJA' : 'Integrado')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessores, setOpcoesProfessores] = useState([])
  const [opcoesCalendarios, setOpcoesCalendarios] = useState([])
  const [errors, setErrors] = useState({});
  const [desabilitado, setDesabilitado] = useState(false)
  const [formData, setFormData] = useState({
    aluno: '',
    professor_ped: '',
    professor_disciplina: '',
    curso: '',
    disciplina: '',
    turma_atual: '',
    serie_progressao: '',
    trimestre_recuperar: '',
    observacao: '',
  });

  const [controleInputs, setControleInputs] = useState({
    aluno: '',
    professor_ped: '',
    professor_disciplina: '',
    curso: '',
    disciplina: '',
    turma_atual: '',
    ano_semestre_reprov: '',
    serie_progressao: '',
    trimestre_recuperar: '',
  })

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

    setControleInputs({...controleInputs, trimestre_recuperar: novoTrimestre.join(', ')})
  };

  const verificaTrimestres = (trimestre) => {
      if (modalidade === 'Integrado') return formData.trimestre_recuperar.includes(trimestre)
  }

  const trocaModalidade = (novoValor) => {
    if (!state) {
      setModalidade(novoValor);
      setOpcoesCalendarios(opcoesCalendarios.filter((calendario) => calendario.tipo_calendario === novoValor))

      if (novoValor === 'Integrado') {
        setFormData({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          turma_atual: '',
          serie_progressao: '',
          trimestre_recuperar: '',
          observacao: '',
        })
  
        setControleInputs({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          turma_atual: '',
          serie_progressao: '',
          trimestre_recuperar: '',
          observacao: '',
        })
      } else {
        setFormData({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          ano_semestre_reprov: '',
          observacao: ''
        })
  
        setControleInputs({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          ano_semestre_reprov: '',
          observacao: '',
        })
      }
    }

    setErrors({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPED(formData, modalidade)

    if (modalidade === 'Integrado') {
      const erroTurma = validarSerieTurma(formData.serie_progressao, turmas.find((turma) => turma.id === formData.turma_atual))

      if (erroTurma) erros.turma_serie = erroTurma
    }
    
    if (Object.keys(erros).length !== 0) {
      console.log(erros)
      setErrors(erros)
    } else {
      try {
        if (state) {
          // verifica se já existe um state, para chamar a view de edição
          if (modalidade === 'Integrado') {
            const res = await PEDService.atualizar_EMI(formData, state.id)

            if (res.status !== 200) throw new Error(res)
          } else {
            const res = await PEDService.atualizar_ProEJA(formData, state.id)

            if (res.status !== 200) throw new Error(res)
          }
        } else {
          if (modalidade === 'Integrado') {
            const res = await PEDService.create_EMI(formData)
  
            if (res.status !== 201) throw new Error(res)
          } else {
            const res = await PEDService.create_ProEJA(formData)
  
            if (res.status !== 201) throw new Error(res)
          }
        }
      
        toast.success(state ? "Dependência atualizada com sucesso" : "Dependência Cadastrada com sucesso", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });

        setFormData({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          turma_origem: '',
          serie_progressao: '',
          trimestre_recuperar: '',
          observacao: '',
          ano_semestre_reprov: '',
        })

        setControleInputs({
          aluno: '',
          curso: '',
          disciplina: '',
          observacao: '',
          professor_disciplina: '',
          professor_ped: '',
          serie_progressao: '',
          trimestre_recuperar: '',
          turma_origem: '',
          ano_semestre_reprov: ''
        })
      
        setErrors({})

      } catch (error) {
        console.error('Erro ao cadastrar dependência: ', error)
      }
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await cursoService.list('dependencia')

      const cursosPorModalidade = res.data.filter((curso) => curso.modalidade === modalidade)

      setCursos(cursosPorModalidade)

      if (state) {
        const index = cursosPorModalidade.findIndex(curso => curso.nome === state.curso.nome)
        console.log(cursosPorModalidade)
        setDisciplinas(cursosPorModalidade[index].disciplinas)
        setTurmas(cursosPorModalidade[index].turmas)
      }

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

  const fetchCalendarios = async (e) => {
    try {
      const res = await calendarioAcademicoService.listarCalendariosAcademicos()

      if (res.status !== 200) throw new Error(res)

      const calendariosFiltrados = res.data.filter((calendario) => calendario.tipo_calendario === modalidade)

      setOpcoesCalendarios(calendariosFiltrados)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (state) {
      console.log(state)

      setControleInputs({
        aluno: state.aluno.nome,
        professor_ped: state.professor_ped.nome,
        professor_disciplina: state.professor_disciplina.nome,
        curso: state.curso.id,
        disciplina: state.disciplina.id,
        turma_atual: state?.turma_atual?.id,
        ano_semestre_reprov: state.ano_semestre_reprov,
        serie_progressao: state.serie_progressao,
        trimestre_recuperar: state.trimestre_recuperar,
        periodo_letivo: state.periodo_letivo.titulo
      })

      setFormData({
        aluno: state.aluno.id,
        professor_ped: state.professor_ped.id,
        professor_disciplina: state.professor_disciplina.id,
        curso: state.curso.id,
        disciplina: state.disciplina.id,
        turma_atual: state?.turma_atual?.id,
        ano_semestre_reprov: state.ano_semestre_reprov,
        serie_progressao: state.serie_progressao,
        trimestre_recuperar: state.trimestre_recuperar,
        periodo_letivo: state.periodo_letivo.id
      })


      setDesabilitado(true)
    } else {
      setFormData({
        aluno: '',
        professor_ped: '',
        professor_disciplina: '',
        curso: '',
        disciplina: '',
        turma_origem: '',
        serie_progressao: '',
        trimestre_recuperar: '',
        observacao: '',
      })

      setControleInputs({
        aluno: '',
        professor_ped: '',
        professor_disciplina: '',
        disciplina: '',
        ano_semestre_reprov: '',
        curso: '',
        serie_progressao: '',
        trimestre_recuperar: '',
        turma_origem: '',
      })

    }

    fetchCursos()
    fetchCalendarios()
  }, [modalidade, state])

  return (
    <>
      <ToastContainer/>
      <FormContainer onSubmit={handleSubmit} titulo={state ? 'Editar PED' : 'Cadastro PED'}>
        {Object.keys(errors).length === 0 ? (<></>) : (<p style={{color: 'red'}}>*Preencha os campos obrigatórios</p>)}
        <span className="spanCadastroPED">
          <p className="pCadastroPED"> 
            Modalidade
          </p>
            <Switch 
              valor1='ProEJA' 
              valor2='Integrado' 
              valor={modalidade} 
              stateHandler={trocaModalidade}
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
                        valor={controleInputs.aluno}
                        onChange={(e) => {
                          setControleInputs({...controleInputs, aluno: e.target.value})

                          fetchAlunos(e)
                          
                          if (opcoesAlunos) {
                            const param = e.target.value
                            console.log(e.target.value)
          
                            const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.matricula|| aluno.email)
          
                            if (aluno) setFormData({...formData, aluno: aluno.id})
                          }
          
                        }}
                        erro={errors.aluno}
                        textoAjuda='Insira nome ou matrícula do aluno'
                        lista={'opcoesAlunos'}
                        desabilitado={desabilitado}
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
                      valor={controleInputs.professor_ped}
                      onChange={(e) => {
                        setControleInputs({...controleInputs, professor_ped: e.target.value})

                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)
          
                          const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
          
                          if (professor) setFormData({...formData, professor_ped: professor.id})
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
                      valor={controleInputs.professor_disciplina}
                      onChange={(e) => {
                        setControleInputs({...controleInputs, professor_disciplina: e.target.value})

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
                      desabilitado={desabilitado}
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
                        <input className={desabilitado ? "checkboxTrimestreDesab" :"checkboxTrimestre"} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('1º')} value='1º' id="1" hidden disabled={desabilitado}/>
                        <label className="labelTrimestreRec" htmlFor="1">1º Trimestre</label>
                        <input className={desabilitado ? "checkboxTrimestreDesab" :"checkboxTrimestre"} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('2º')} value='2º' id="2" hidden disabled={desabilitado}/>
                        <label className="labelTrimestreRec" htmlFor="2">2º Trimestre</label>
                        <input className={desabilitado ? "checkboxTrimestreDesab" :"checkboxTrimestre"} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('3º')} value='3º' id='3' hidden disabled={desabilitado}/>
                        <label className="labelTrimestreRec" htmlFor="3">3º Trimestre</label>
                      </div>
                    </label>
                    <label className="labelCadastroPED">
                    Período Letivo *
                    <select className={errors.periodo_letivo ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="periodo_letivo"
                      value={controleInputs.periodo_letivo}
                      disabled={desabilitado}
                      onChange={(e) => {                        
                        const periodo_letivoId = e.target.value;
                        
                        const periodo_letivo = opcoesCalendarios.find(periodo_letivo => periodo_letivo.id === Number(periodo_letivoId)); // Encontra o periodo_letivo correspondente
                        
                        if (periodo_letivo) {
                          setFormData({...formData, periodo_letivo: Number(e.target.value)})
                          setDisciplinas(periodo_letivo.disciplinas);
                          setTurmas(periodo_letivo.turmas)
                        }
                      }
                    }>
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione um período letivo'}</option>
                        ) : (<></>)
                      }
                      {
                        opcoesCalendarios.map((calendario, index) => (
                          <option className="optionCadastroPED" value={calendario.id} key={index}>{calendario.titulo}</option>
                        ))
                      }
                    </select>
                    </label>
                </div>
              </section>
              <section className="sectionCadastroPED">
                <div className="divCadastroPED">
                  <label className="labelCadastroPED">
                    Curso *
                    <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso"
                      value={formData.curso}
                      disabled={desabilitado}
                      onChange={(e) => {                        
                        const cursoId = e.target.value;
                        
                        const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                        
                        if (curso) {
                          setFormData({...formData, curso: Number(e.target.value)})
                          setDisciplinas(curso.disciplinas);
                          setTurmas(curso.turmas)
                        }
                      }
                    }>
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione um curso'}</option>
                        ) : (<></>)
                      }
                      {
                        cursos.map((curso, index) => (
                          <option className="optionCadastroPED" value={curso.id} key={index}>{curso.nome}</option>
                        ))
                      }
                    </select>
                  </label>
                  <label className="labelCadastroPED">
                    Disciplina *
                    <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                      value={formData.disciplina}
                      disabled={desabilitado}
                      onChange={(e) => {
                        setFormData({...formData, disciplina: Number(e.target.value)})}}
                    >
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione uma disciplina'}</option>
                        ) : (<></>)
                      }
                      {
                        disciplinas?.map((disciplina, index) => (
                          <option className="optionCadastroPED" value={disciplina.id} key={index}>{disciplina.nome}</option>
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
                    value={formData.serie_progressao}
                    onChange={(e) => {
                      setFormData({ ...formData, serie_progressao: e.target.value })
                    }}
                    disabled={desabilitado}
                  >
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione uma serie para progressão'}</option>
                        ) : (<></>)
                      }
                      {
                        serieProgressao.map((serie, index) => (
                          <option className="optionCadastroPED" value={serie.id} key={index}>{serie}</option>
                        ))
                      }
                  </select>
                  {errors.turma_serie ? <p style={{color: 'red', fontSize: '10px'}}>{errors.turma_serie}</p> : <></>}
                </label>
                <label className="labelCadastroPED">
                  Turma Atual *
                  <select
                    className={errors.turma_atual || errors.turma_serie ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                    value={formData.turma_atual}
                    onChange={(e) => {
                      setFormData({ ...formData, turma_atual: Number(e.target.value) })
                    }}
                    disabled={desabilitado}
                  >
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione uma turma'}</option>
                        ) : (<></>)
                      }
                      {
                        turmas?.map((turma, index) => (
                          <option className="optionCadastroPED" value={turma.id} key={index}>{turma.numero}</option>
                        ))
                      }
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
                  valor={controleInputs.aluno}
                  onChange={(e) => {
                    setControleInputs({...controleInputs, aluno: e.target.value})

                    fetchAlunos(e)
                    
                    if (opcoesAlunos) {
                      const param = e.target.value
                      console.log(e.target.value)
    
                      const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || aluno.matricula || aluno.email)
    
                      if (aluno) setFormData({...formData, aluno: aluno.id})
                    }    
                  }}
                  erro={errors.aluno}
                  textoAjuda='Insira nome ou matrícula do aluno'
                  lista={'opcoesAlunos'}
                  desabilitado={desabilitado}
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
                      valor={controleInputs.professor_ped}
                      onChange={(e) => {
                        setControleInputs({...controleInputs, professor_ped: e.target.value})
                        fetchProfessores(e)
                        
                        if (opcoesProfessores) {
                          const param = e.target.value
                          console.log(e.target.value)
          
                          const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)
          
                          if (professor) setFormData({...formData, professor_ped: professor.id})
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
                  valor={controleInputs.professor_disciplina}
                  onChange={(e) => {
                    setControleInputs({...formData, professor_disciplina: e.target.value})
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
                  desabilitado={desabilitado}
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
                <select className={errors.curso ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="curso" 
                    value={formData.curso}
                    disabled={desabilitado}
                    onChange={(e) => {

                    const cursoId = e.target.value;
                  
                    const curso = cursos.find(curso => curso.id === Number(cursoId)); // Encontra o curso correspondente
                    console.log(curso)

                    if (curso) {
                      setFormData({...formData, curso: Number(e.target.value)})
                      setDisciplinas(curso.disciplinas);
                    }
                  }
                }>
                  {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione um curso'}</option>
                        ) : (<></>)
                      }
                      {
                        cursos.map((curso, index) => (
                          <option className="optionCadastroPED" value={curso.id} key={index}>{curso.nome}</option>
                        ))
                      }
                </select>
              </label>
              <label className="labelCadastroPED">
                Disciplina *
                <select className={errors.disciplina ? 'errorSelectCadastroPED' : 'selectCadastroPED'}
                  value={formData.disciplina}
                  disabled={desabilitado}
                  onChange={(e) => {
                    setFormData({...formData, disciplina: Number(e.target.value)})}}
                >
                  {
                    !state ? (
                      <option className="optionCadastroPED" value=''>{'Selecione uma disciplina'}</option>
                    ) : (<></>)
                  }
                  {
                    disciplinas.map((disciplina, index) => (
                      <option className="optionCadastroPED" value={disciplina.id} key={index}>{disciplina.nome}</option>
                    ))
                  }
                </select>
              </label>
              <label className="labelCadastroPED">
                Ano/Semestre de Reprovação *
                <Input
                  type='text'
                  disabled={desabilitado}
                  onChange={(e) => {
                    setFormData({...formData, ano_semestre_reprov: e.target.value})
                }}
                  valor={formData.ano_semestre_reprov}
                  erro={errors.ano_semestre_reprov}
                  textoAjuda='Insira no formato Ano/Semestre - xxxx/x'
                  desabilitado={desabilitado}
                />
              </label>
              <label className="labelCadastroPED">
                    Período Letivo *
                    <select className={errors.periodo_letivo ? 'errorSelectCadastroPED' : 'selectCadastroPED'} name="periodo_letivo"
                      value={formData.periodo_letivo}
                      disabled={desabilitado}
                      onChange={(e) => {                        
                        const periodo_letivoId = e.target.value;
                        
                        const periodo_letivo = opcoesCalendarios.find(periodo_letivo => periodo_letivo.id === Number(periodo_letivoId)); // Encontra o periodo_letivo correspondente
                        
                        if (periodo_letivo) {
                          setFormData({...formData, periodo_letivo: Number(e.target.value)})
                          setDisciplinas(periodo_letivo.disciplinas);
                          setTurmas(periodo_letivo.turmas)
                        }
                      }
                    }>
                      {
                        !state ? (
                          <option className="optionCadastroPED" value=''>{'Selecione um período letivo'}</option>
                        ) : (<></>)
                      }
                      {
                        opcoesCalendarios.map((calendario, index) => (
                          <option className="optionCadastroPED" value={calendario.id} key={index}>{calendario.titulo}</option>
                        ))
                      }
                    </select>
              </label>
            </>
          )
        }
        <label className="labelCadastroPED">
          Observação (opcional)
          <textarea
            className="textAreaCadastroPED"
            onChange={(e) => {

              setFormData({...formData, observacao: e.target.value})
            }}
            name="observacao"
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <div className="containerBotoes" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap'}}>
          <Button color="#006b3f" text={state ? 'Salvar Alterações' : 'Cadastrar'} tipo="submit" />
        </div>
      </FormContainer>
    </>
  );
};

export default CadastroPED;
