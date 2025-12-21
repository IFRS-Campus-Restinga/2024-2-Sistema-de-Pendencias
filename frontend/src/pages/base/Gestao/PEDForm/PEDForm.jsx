import styles from "./PEDForm.module.css";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import Switch from '../../../../components/Switch/Switch'
import OpcoesBusca from "../../../../components/OpcoesBusca/OpcoesBusca";
import Label from "../../../../components/Label/Label";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";
import { toast } from 'react-toastify'
import { useEffect, useState } from "react";
import { PEDService } from "../../../../services/pedService";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { UsuarioService } from "../../../../services/usuarioService";
import { validarAnoSemestreReprov, validarCampoUUID4 } from "../../../../utils/validacoes";
import { AxiosError } from "axios";
import { calendarioService } from "../../../../services/calendarioService";
import cursoService from "../../../../services/cursoService";
import { disciplinaService } from "../../../../services/disciplinaService";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import modalidadeMap from "../../../../utils/modalidadeMap";
import Select from "../../../../components/Select/Select";

const PEDForm = () => {
  const location = useLocation()
  const redirect = useNavigate()
  const { state } = location || {}
  const tipoPed = location.pathname.split('/')[4];
  const [carregando, setCarregando] = useState(true)
  const [modalidade, setModalidade] = useState(state?.modalidade ? state.modalidade : tipoPed ? tipoPed : 'Integrado')
  const [opcoesTurmaAtual, setOpcoesTurmaAtual] = useState([])
  const [opcoesAlunos, setOpcoesAlunos] = useState([])
  const [opcoesProfessoresPED, setOpcoesProfessoresPED] = useState([])
  const [opcoesProfessoresDisciplina, setOpcoesProfessoresDisciplina] = useState([])
  const [opcoesCalendarios, setOpcoesCalendarios] = useState([])
  const [opcoesCursos, setOpcoesCursos] = useState([])
  const [opcoesDisciplinas, setOpcoesDisciplinas] = useState([])
  const [erros, setErros] = useState({});
  const [desabilitado, setDesabilitado] = useState(false)
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false)
  const [formData, setFormData] = useState({
    aluno: '',
    professor_ped: '',
    professor_disciplina: '',
    curso: '',
    disciplina: '',
    turma_atual: '',
    periodo_letivo: '',
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
    periodo_letivo: '',
  })

  const serieProgressao = [
    {
      title: '1º ano'
    },
    {
      title: '2º ano'
    },
    {
      title: '3º ano'
    },
    {
      title: '4º ano'
    },
  ]

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

    setControleInputs({ ...controleInputs, trimestre_recuperar: novoTrimestre.join(', ') })
  };

  const verificaTrimestres = (trimestre) => {
    if (modalidade === 'Integrado' && formData.trimestre_recuperar) return formData.trimestre_recuperar.includes(trimestre)
  }

  const trocaModalidade = (novoValor) => {
    if (state.modalidade) {
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
          periodo_letivo: '',
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
          periodo_letivo: ''
        })
      } else {
        setFormData({
          aluno: '',
          professor_ped: '',
          professor_disciplina: '',
          curso: '',
          disciplina: '',
          ano_semestre_reprov: '',
          periodo_letivo: '',
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
          periodo_letivo: ''
        })
      }
    }

    setErros({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBotaoDesabilitado(true)

    if (validarForm()) {
      let req
      if (state && !state.modalidade) {
        req = PEDService.editar(formData, state, modalidade)
      } else {
        req = PEDService.criar(formData, modalidade);
      }

      toast.promise(
        req,
        {
          pending: 'Realizando registro...',
          success: {
            render({data}) {
              return data.data.message
            }
          },
          error: "Erro de Validação"
        },
      ).then((res) => {
        if (res.status === 200 || res.status === 201) {
          setErros({})
          setTimeout(() => {
            redirect(`/session/gestao_escolar/peds/${modalidade}/`)
          }, 3000);
        }
      }).catch((err) => {
          if (err instanceof AxiosError) {
              const errors = err.response?.data?.message;

              if (Array.isArray(errors)) {
                  errors.forEach((msg) => toast.error(msg));
              } else {
                  toast.error(errors);
              }
          }
      })
    }

    setBotaoDesabilitado(false)
  };

  const fetchAlunos = async (e) => {
    try {
      const res = await UsuarioService.buscarHub(undefined, e.target.value, 'aluno', 'id, username')

      setOpcoesAlunos(res.data.results)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchProfessores = async (e, tipo) => {
    try {
      const res = await UsuarioService.listarGrupo("professor", undefined, e.target.value, 'id, username')

      if (res.status !== 200) throw new Error(res)

      if (tipo === 'ped') setOpcoesProfessoresPED(res.data.results)
      if (tipo === 'disciplina') setOpcoesProfessoresDisciplina(res.data.results)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchCalendarios = async (e) => {
    try {
      const res = await calendarioService.buscar(undefined, e.target.value, 'id, title')

      setOpcoesCalendarios(res.data.results)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchCurso = async (e) => {
    try {
      const res = await cursoService.buscarPorModalidade(undefined, e.target.value, modalidadeMap[modalidade], 'id, name, course_class.id, course_class.number')

      if (res.status !== 200) throw new Error(res)

      setOpcoesCursos(res.data.results)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchDisciplina = async (e) => {
    try {
      if (!formData.curso || formData.curso === '') {
        setErros({ ...erros, disciplina: 'É necessário selecionar um curso antes de buscar uma disciplina' })
      } else {
        setErros({ ...erros, disciplina: null })

        const res = await disciplinaService.buscarPorCurso(formData.curso, undefined, e.target.value, 'id, name, code')

        setOpcoesDisciplinas(res.data.results)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const getFormat = () => {
    if (modalidade === 'Integrado') return 'id, aluno, professor_ped, professor_disciplina, curso, disciplina, trimestre_recuperar, periodo_letivo, turma_atual, serie_progressao, observacao'
    
    if (modalidade === "ProEJA") return 'id, aluno, professor_ped, professor_disciplina, curso, disciplina, ano_semestre_reprov, periodo_letivo, observacao'
  }

  const fetchPED = async () => {
    const format = getFormat()
    try {
      const res = await PEDService.porId(
        state, 
        modalidade, 
        format, 
        'obj'
      );
      
      setFormData({
        aluno: res.data.aluno.id,
        professor_disciplina: res.data.professor_disciplina.id,
        professor_ped: res.data.professor_ped.id,
        curso: res.data.curso.id,
        disciplina: res.data.disciplina.id,
        periodo_letivo: res.data.periodo_letivo.id,
        observacao: res.data.observacao,
        // dados ped emi
        ...(res.data.trimestre_recuperar && { trimestre_recuperar: res.data.trimestre_recuperar }),
        ...(res.data.serie_progressao && { serie_progressao: res.data.serie_progressao }),
        ...(res.data.turma_atual && { turma_atual: res.data.turma_atual.id }),
        // dados ped proeja
        ...(res.data.ano_semestre_reprov && { ano_semestre_reprov: res.data.ano_semestre_reprov })
      })

      setControleInputs({
        aluno: res.data.aluno.username,
        professor_disciplina: res.data.professor_disciplina.username,
        professor_ped: res.data.professor_ped.username,
        curso: res.data.curso.name,
        disciplina: res.data.disciplina.name,
        periodo_letivo: res.data.periodo_letivo.title,
        observacao: res.data.observacao,
        // dados ped emi
        ...(res.data.serie_progressao && { serie_progressao: res.data.serie_progressao }),
        ...(res.data.trimestre_recuperar && { trimestre_recuperar: res.data.trimestre_recuperar }),
        ...(res.data.turma_atual && { turma_atual: res.data.turma_atual.number }),
        // dados ped proeja
        ...(res.data.ano_semestre_reprov && { ano_semestre_reprov: res.data.ano_semestre_reprov })
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setCarregando(false)
    }
  };

  const validarForm = () => {
    let novosErros = {}

    for (let campo in formData) {
      if (modalidade === "Integrado") {
        if (campo !== 'observacao' && campo !== 'trimestre_recuperar' && campo !== 'serie_progressao' && campo !== 'ano_semestre_reprov') novosErros[campo] = validarCampoUUID4(formData[campo])
  
        if (campo === 'serie_progressao') {
          if (formData.serie_progressao === '') novosErros.serie_progressao = 'Campo obrigatório'
  
          if (formData.serie_progressao[0] >= controleInputs.turma_atual[0]) novosErros.turma_serie = 'Turma atual deve ser superior à série de progressão'
        }
  
        if (campo === 'trimestre_recuperar') {
          if (formData.trimestre_recuperar === '') novosErros.trimestre_recuperar = 'Campo obrigatório'
        }
      }
      if (modalidade === "ProEJA") {
        if (campo === 'ano_semestre_reprov') novosErros.ano_semestre_reprov = validarAnoSemestreReprov(formData.ano_semestre_reprov)
      }
    }

    setErros(novosErros)

    return Object.values(novosErros).every((erro) => erro === null) ?? Object.keys(novosErros).length === 0

  }

  useEffect(() => {
    if (state) {
      if (!state.modalidade) {
        setDesabilitado(true)
        fetchPED()
      } else {
        setCarregando(false)
      }
    } else {
      setCarregando(false)
    }
  }, [modalidade, state])

  if (carregando) return <CustomLoading/>

  return (
    <FormContainer titulo={state ? 'Editar PED' : 'Cadastro PED'}>
      {Object.values(erros).some((erro) => erro !== null) ? <MensagemErro mensagem={'*Preencha os campos obrigatórios'} /> : null}
      <ToastContainer autoClose={2000} position="bottom-right" />
      <form onSubmit={handleSubmit}>
        <span className={styles.span}>
          <p className={styles.p}>
            Modalidade
          </p>
          <Switch
            valor1='ProEJA'
            valor2='Integrado'
            valor={modalidade}
            stateHandler={trocaModalidade}
            imagemCustom={state && !state.modalidade ? <FontAwesomeIcon icon={faLock} size="xl" color={modalidade === 'Integrado' ? '#006b3f' : '#fff'} /> : <></>}
          />
        </span>
        {
          modalidade === 'Integrado' ? (
            <>
              <section className={styles.section}>
                <div className={styles.formGroup}>
                  <Label titulo={'Aluno *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo='text'
                        nome='aluno'
                        valor={controleInputs.aluno}
                        onChange={(e) => {
                          fetchAlunos(e)
                          setControleInputs({ ...controleInputs, aluno: e.target.value })
                        }}
                        erro={erros.aluno}
                        textoAjuda='Insira nome ou matrícula do aluno'
                        desabilitado={desabilitado}
                      />
                      {
                        opcoesAlunos?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesAlunos}
                            setValor={(opcao) => {
                              setFormData({ ...formData, aluno: opcao.id })
                              setControleInputs({ ...controleInputs, aluno: opcao.username })
                              setOpcoesAlunos([])
                            }}
                            chave={'username'}
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                  <Label titulo={'Docente responsável pela progressão *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo='text'
                        nome='professor'
                        valor={controleInputs.professor_ped}
                        onChange={(e) => {
                          fetchProfessores(e, 'ped')
                          setControleInputs({ ...controleInputs, professor_ped: e.target.value })
                        }}
                        erro={erros.professor_ped}
                        textoAjuda='Insira o email ou nome do professor'
                      />
                      {
                        opcoesProfessoresPED?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesProfessoresPED}
                            setValor={(opcao) => {
                              setFormData({ ...formData, professor_ped: opcao.id })
                              setControleInputs({ ...controleInputs, professor_ped: opcao.username })
                              setOpcoesProfessoresPED([])
                            }}
                            chave={'username'}
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                  <Label titulo={'Docente que ministrou a disciplina *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo='text'
                        nome='professor'
                        valor={controleInputs.professor_disciplina}
                        onChange={(e) => {
                          fetchProfessores(e, 'disciplina')
                          setControleInputs({ ...controleInputs, professor_disciplina: e.target.value })
                        }}
                        erro={erros.professor_disciplina}
                        textoAjuda='Insira o email ou nome do professor'
                        desabilitado={desabilitado}
                      />
                      {
                        opcoesProfessoresDisciplina?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesProfessoresDisciplina}
                            setValor={(opcao) => {
                              setFormData({ ...formData, professor_disciplina: opcao.id })
                              setControleInputs({ ...controleInputs, professor_disciplina: opcao.username })
                              setOpcoesProfessoresDisciplina([])
                            }}
                            chave={'username'}
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                </div>
                <div className={styles.formGroup}>
                  <Label titulo={"Trimestres a Recuperar *"}>
                    <div className={styles.divTrimestreRec}>
                      <input className={desabilitado ? styles.checkboxTrimestreDesab : styles.checkboxTrimestre} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('1º')} value='1º' id="1" hidden disabled={desabilitado} />
                      <label className={styles.labelTrimestreRec} htmlFor="1">1º Trimestre</label>
                      <input className={desabilitado ? styles.checkboxTrimestreDesab : styles.checkboxTrimestre} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('2º')} value='2º' id="2" hidden disabled={desabilitado} />
                      <label className={styles.labelTrimestreRec} htmlFor="2">2º Trimestre</label>
                      <input className={desabilitado ? styles.checkboxTrimestreDesab : styles.checkboxTrimestre} onChange={handleTrimestreRec} type="checkbox" checked={verificaTrimestres('3º')} value='3º' id='3' hidden disabled={desabilitado} />
                      <label className={styles.labelTrimestreRec} htmlFor="3">3º Trimestre</label>
                    </div>
                    {erros.trimestre_recuperar !== '' ? <MensagemErro mensagem={erros.trimestre_recuperar} /> : null}
                  </Label>
                  <Label titulo={'Período Letivo *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo={'text'}
                        valor={controleInputs.periodo_letivo}
                        onChange={(e) => {
                          setControleInputs({ ...controleInputs, periodo_letivo: e.target.value })
                          fetchCalendarios(e)
                        }}
                        erro={erros.periodo_letivo}
                        textoAjuda={'Pesquise o calendário escolar'}
                        desabilitado={desabilitado}
                      />
                      {
                        opcoesCalendarios?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesCalendarios}
                            setValor={(opcao) => {
                              setFormData({ ...formData, periodo_letivo: opcao.id })
                              setControleInputs({ ...controleInputs, periodo_letivo: opcao.title })
                              setOpcoesCalendarios([])
                            }}
                            chave={'title'}
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                </div>
              </section>
              <section className={styles.section}>
                <div className={styles.formGroup}>
                  <Label titulo={'Curso *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo={'text'}
                        valor={controleInputs.curso}
                        onChange={(e) => {
                          setControleInputs({ ...controleInputs, curso: e.target.value })
                          fetchCurso(e)
                        }}
                        erro={erros.curso}
                        textoAjuda={'Pesquise o Curso'}
                        desabilitado={desabilitado}
                      />
                      {
                        opcoesCursos?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesCursos}
                            setValor={(opcao) => {
                              setFormData({ ...formData, curso: opcao.id })
                              setControleInputs({ ...controleInputs, curso: opcao.name })
                              setOpcoesTurmaAtual(opcao.course_class)
                              setOpcoesCursos([])
                            }}
                            chave={'name'}
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                  <Label titulo={'Disciplina *'}>
                    <div className={styles.inputContainer}>
                      <Input
                        tipo={'text'}
                        valor={controleInputs.disciplina}
                        onChange={(e) => {
                          setControleInputs({ ...controleInputs, disciplina: e.target.value })
                          fetchDisciplina(e)
                        }}
                        erro={erros.disciplina}
                        textoAjuda={'Pesquise a disciplina'}
                        desabilitado={desabilitado}
                      />
                      {
                        opcoesDisciplinas?.length > 0 ? (
                          <OpcoesBusca
                            opcoes={opcoesDisciplinas}
                            setValor={(opcao) => {
                              setFormData({ ...formData, disciplina: opcao.id })
                              setControleInputs({ ...controleInputs, disciplina: opcao.name })
                              setOpcoesDisciplinas([])
                            }}
                            chave={'name'}  
                          />
                        ) : null
                      }
                    </div>
                  </Label>
                </div>
                <div className={styles.selectFormGroup}>
                  <Label titulo={'Série da Progressão *'}>
                    <div className={styles.inputContainer}>
                      <Select
                        chave='title'
                        opcoes={serieProgressao}
                        selecionado={formData.serie_progressao}
                        setValor={(opcao) => {
                          setFormData({...formData, serie_progressao: opcao.title})
                        }}
                        desabilitado={desabilitado}
                      />
                      {erros.turma_serie !== '' ? <MensagemErro mensagem={erros.turma_serie} /> : null}
                    </div>
                  </Label>
                  <Label titulo={'Turma *'}>
                    <div className={styles.inputContainer}>
                      <Select
                        chave='number'
                        opcoes={opcoesTurmaAtual}
                        selecionado={controleInputs.turma_atual}
                        setValor={(opcao) => {
                          setFormData({...formData, turma_atual: opcao.id})
                          setControleInputs({...controleInputs, turma_atual: opcao.number})
                        }}
                        desabilitado={state ? desabilitado : formData.curso ? false : true}
                      />
                      {erros.turma_serie !== '' ? <MensagemErro mensagem={erros.turma_serie} /> : null}
                    </div>
                  </Label>
                </div>
              </section>
            </>
          ) : modalidade === 'ProEJA' ? (
            <>
              <Label titulo={'Aluno *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='aluno'
                    valor={controleInputs.aluno}
                    onChange={(e) => {
                      fetchAlunos(e)
                      setControleInputs({ ...controleInputs, aluno: e.target.value })
                    }}
                    erro={erros.aluno}
                    textoAjuda='Insira nome ou matrícula do aluno'
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesAlunos?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesAlunos}
                        setValor={(opcao) => {
                          setFormData({ ...formData, aluno: opcao.id })
                          setControleInputs({ ...controleInputs, aluno: opcao.username })
                          setOpcoesAlunos([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
              </Label>
              <Label titulo={'Docente responsável pela progressão *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='professor'
                    valor={controleInputs.professor_ped}
                    onChange={(e) => {
                      fetchProfessores(e, 'ped')
                      setControleInputs({ ...controleInputs, professor_ped: e.target.value })
                    }}
                    erro={erros.professor_ped}
                    textoAjuda='Insira o email ou nome do professor'
                  />
                  {
                    opcoesProfessoresPED?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesProfessoresPED}
                        setValor={(opcao) => {
                          setFormData({ ...formData, professor_ped: opcao.id })
                          setControleInputs({ ...controleInputs, professor_ped: opcao.username })
                          setOpcoesProfessoresPED([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
              </Label>
              <Label titulo={'Docente que ministrou a disciplina *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='professor'
                    valor={controleInputs.professor_disciplina}
                    onChange={(e) => {
                      fetchProfessores(e, 'disciplina')
                      setControleInputs({ ...controleInputs, professor_disciplina: e.target.value })
                    }}
                    erro={erros.professor_disciplina}
                    textoAjuda='Insira o email ou nome do professor'
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesProfessoresDisciplina?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesProfessoresDisciplina}
                        setValor={(opcao) => {
                          setFormData({ ...formData, professor_disciplina: opcao.id })
                          setControleInputs({ ...controleInputs, professor_disciplina: opcao.username })
                          setOpcoesProfessoresDisciplina([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
              </Label>
              <Label titulo={'Curso *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo={'text'}
                    valor={controleInputs.curso}
                    onChange={(e) => {
                      setControleInputs({ ...controleInputs, curso: e.target.value })
                      fetchCurso(e)
                    }}
                    erro={erros.curso}
                    textoAjuda={'Pesquise o Curso'}
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesCursos?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesCursos}
                        setValor={(opcao) => {
                          setFormData({ ...formData, curso: opcao.id })
                          setControleInputs({ ...controleInputs, curso: opcao.name })
                          setOpcoesCursos([])
                        }}
                        chave={'name'}
                      />
                    ) : null
                  }
                </div>
              </Label>
              <Label titulo={'Disciplina *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo={'text'}
                    valor={controleInputs.disciplina}
                    onChange={(e) => {
                      setControleInputs({ ...controleInputs, disciplina: e.target.value })
                      fetchDisciplina(e)
                    }}
                    erro={erros.disciplina}
                    textoAjuda={'Pesquise a disciplina'}
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesDisciplinas?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesDisciplinas}
                        setValor={(opcao) => {
                          setFormData({ ...formData, disciplina: opcao.id })
                          setControleInputs({ ...controleInputs, disciplina: opcao.name })
                          setOpcoesDisciplinas([])
                        }}
                        chave={'name'}
                      />
                    ) : null
                  }
                </div>
              </Label>
              <Label titulo={'Ano/Semestre de reprovação *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    disabled={desabilitado}
                    onChange={(e) => {
                      setFormData({ ...formData, ano_semestre_reprov: e.target.value })
                    }}
                    onBlur={() => setErros({ ...erros, ano_semestre_reprov: validarAnoSemestreReprov(formData.ano_semestre_reprov) })}
                    valor={formData.ano_semestre_reprov}
                    erro={erros.ano_semestre_reprov}
                    textoAjuda='Insira no formato Ano/Semestre - xxxx/x'
                    desabilitado={desabilitado}
                  />
                </div>
              </Label>
              <Label titulo={'Período Letivo *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo={'text'}
                    valor={controleInputs.periodo_letivo}
                    onChange={(e) => {
                      setControleInputs({ ...controleInputs, periodo_letivo: e.target.value })
                      fetchCalendarios(e)
                    }}
                    erro={erros.periodo_letivo}
                    textoAjuda={'Pesquise o calendário escolar'}
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesCalendarios?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesCalendarios}
                        setValor={(opcao) => {
                          setFormData({ ...formData, periodo_letivo: opcao.id })
                          setControleInputs({ ...controleInputs, periodo_letivo: opcao.title })
                          setOpcoesCalendarios([])
                        }}
                        chave={'title'}
                      />
                    ) : null
                  }
                </div>
              </Label>
            </>
          ) : null
        }
        <Label titulo={'Observacao (opcional)'}>
          <textarea
            className={styles.textArea}
            onChange={(e) => {

              setFormData({ ...formData, observacao: e.target.value })
            }}
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </Label>
        <Button color="#006b3f" texto={state ? 'Salvar Alterações' : 'Cadastrar'} tipo="submit" disabled={botaoDesabilitado} />
      </form>
    </FormContainer >
  );
};

export default PEDForm;
