import styles from "./DetalhesDependencia.module.css";
import { useContext, useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Button from "../Button/Button";
import StatusBalls from "../StatusBall/StatusBall";
import Dropdown from "../Dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import { PEDService } from "../../services/pedService";
import { PPTService } from "../../services/pptService";
import { toast, ToastContainer } from "react-toastify";
import gearIcon from '../../assets/gear-svgrepo-com.svg'
import Modal from '../Modal/Modal'
import Label from "../Label/Label";
import MensagemErro from "../MensagemErro/MensagemErro";
import { validarCampoObrigatorio } from "../../utils/validacoes";
import AcompanhamentoService from "../../services/acompanhamentoService.js";
import seta from '../../assets/chevron-down-svgrepo-com.svg'
import editIcone from '../../assets/edit-3-svgrepo-com.svg'
import { AxiosError } from "axios";
import { UserContext } from "../../store/UserContext.jsx";

const DetalhesDependencia = ({ dependencia, tipo, modalidade, fetchDependencia }) => {
  const redirect = useNavigate()
  const { user } = useContext(UserContext)
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false)
  const [modalAberto, setModalAberto] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [prox, setProx] = useState(null)
  const [prev, setPrev] = useState(null)
  const [status, setStatus] = useState("")
  const [acompanhamento, setAcompanhamento] = useState({
    id: '',
    parecer: '',
    status: '',
    ped: dependencia.id,
    data_criacao: '',
    autor: {
      id: '',
      username: ''
    }
  })
  const [tipoModal, setTipoModal] = useState('acomp')
  const [formData, setFormData] = useState({
    id: '',
    parecer: '',
    status: 'Leve',
    ped: dependencia.id,
  })
  const [gravidadeIndex, setGravidadeIndex] = useState(
    (() => {
      const map = { 'Leve': 0, 'Moderada': 1, 'Grave': 2, 'Gravíssima': 3 };
      return formData.status ? (map[formData.status] ?? 0) : 0;
    })()
  );
  const [erros, setErros] = useState({
    parecer: null,
  })

  const setLink = (id, nome) => {
    if (id) return `${nome}/${id}`

    if (user.group === 'professor') return `${nome}`

    return null
  }

  const trocarStatusDependencia = async () => {
    let req

    setBotaoDesabilitado(true)

    if (tipo === 'PED') req = PEDService.trocarStatus(modalidade, dependencia.id, status)
    if (tipo === 'PPT') req = PPTService.trocarStatus(dependencia.id, status)

    toast.promise(
      req,
      {
        pending: `Atualizando status da progressão para ${status}...`,
        success: {
          render({data}) {
            return data.data.message
          }
        },
        error: "Erro de validação"
      },
      ).then((res) => {
        if (res.status == 200) {
          setModalAberto(false)
          fetchDependencia()
        }
      }).catch((err) => {
        if (err instanceof AxiosError) {
          err.response.data.message.map((message) => {
            toast.error(message)
          })
        }
      });

    setBotaoDesabilitado(false)
  }

  const validarForm = () => {
    let novosErros = {
      parecer: null,
    }

    for (let campo in formData) {
      switch (campo) {
        case 'parecer':
          novosErros.parecer = validarCampoObrigatorio(formData.parecer)
          break;
        default:
          break;
      }
    }

    setErros(novosErros)
    return Object.values(novosErros).every((erro) => erro === null)
  }

  const submit = async (e) => {
    e.preventDefault()

    if (validarForm()) {
      const promise = formData.id 
            ? AcompanhamentoService.editar(modalidade, formData.id, formData)
            : AcompanhamentoService.criar(modalidade, formData)
        
            toast.promise(promise, 
                {
                    pending: "Registrando Acompanhamento...",
                    success: {
                        render({ data }) {
                            return data.data.mensagem
                        },
                    },
                    error: {
                        render({ data }) {
                        const response = data?.response?.data
                        if (response?.errors && Array.isArray(response.errors)) {
                            response.errors.forEach(msg => toast.error(msg))
                        }
                        return response?.mensagem ?? "Ocorreu um erro ao registrar."
                        },
                    },
                }
            ).then((res) => {
              if (res.status === 201 || res.status === 200) {
                setModalAberto(false)
                setTipoModal('acomp')
                fetchAcompanhamento()
              }
            })

    }
  }

  const fetchAcompanhamento = async () => {
    try {
      const res = await AcompanhamentoService.listar(modalidade, dependencia.id, pagina)

      setAcompanhamento(res.data.results[0] ?? null)
      setProx(res.data.next ? pagina + 1 : null)
      setPrev(res.data.previous ? pagina - 1 : null)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validarAutor = () => {
    if (user.group === 'gestao_escolar') return true

    if (user.group === 'coord' && dependencia.curso.coord === user.id) return true

    if (
      user.group === 'professor' &&
      dependencia.professores?.some(
        (professor) =>
          professor.id === user.id && professor.resp_atual === true
      )
    ) {
      return true;
    }

    return false
  }

  const validarEdicao = () => {
    if (acompanhamento.autor.id === user.id && ['Criada', 'Em Andamento'].includes(dependencia.status)) return true
  }

  useEffect(() => {
    if (tipo === 'PED') {
      fetchAcompanhamento()
    } else {
      setIsLoading(false)
    }
  }, [pagina])

  return (
    <FormContainer
      titulo={`Detalhes da ${tipo} ${modalidade ? modalidade : ''}`}
      comprimento="80%"
    >
      <ToastContainer/>
      <label className={styles.cabecalho}>
        <span className={styles.span}>
          Aluno - <p className={styles.nomeAluno}>{dependencia.aluno}</p>
        </span>
        <label className={styles.status}>Andamento da {tipo}</label>
      </label>
      <section className={styles.section}>
        <div className={styles.div}>
          <span className={styles.dados}>
            <label className={styles.label}>
              Docente responsável pela progressão
              {
                dependencia?.professores?.length > 0 ? (
                  dependencia?.professores.map((professor) => (
                    <ul className={styles.ul}>
                      <li className={styles.li}>
                        {professor.username}
                        {
                          professor.resp_atual ? (
                            <p className={styles.resp}>Resp. Atual</p>
                          ) : null
                        }
                      </li>
                    </ul>
                  ))
                ) : (
                  <p className={styles.p}>{dependencia.professor_ppt}</p>
                )
              }
            </label>
            <label className={styles.label}>
              Docente que ministrou a disciplina
              <p className={styles.p}>{dependencia.professor_disciplina}</p>
            </label>
          </span>
          <span className={styles.dados}>
            <label className={styles.label}>
              Curso
              <p className={styles.p}>{dependencia.curso.name}</p>
            </label>
            <label className={styles.label}>
              Disciplina
              <p className={styles.p}>{dependencia.disciplina}</p>
            </label>
          </span>
          <span className={styles.dados}>
            {
              modalidade === 'Integrado' ? (
                <>
                  <label className={styles.label}>
                    Trimestres a Recuperar
                    <p className={styles.p}>{dependencia.trimestre_recuperar}</p>
                  </label>
                  <label className={styles.label}>
                    Série da Progressão
                    <p className={styles.p}>{dependencia.serie_progressao}</p>
                  </label>
                  <label className={styles.label}>
                    Turma Atual
                    <p className={styles.p}>{dependencia.turma_atual}</p>
                  </label>
                </>
              ) : modalidade === 'ProEJA' ? (
                <label className={styles.label}>
                  Ano/Semestre de Reprovacao
                  <p className={styles.p}>{dependencia.ano_semestre_reprov}</p>
                </label>
              ) : (
                <>
                  <label className={styles.label}>
                    Turma Atual
                    <p className={styles.p}>{dependencia.turma_atual}</p>
                  </label><label className={styles.label}>
                    Turma da Progressão
                    <p className={styles.p}>{dependencia.turma_progressao}</p>
                  </label>
                </>
              )
            }
            <label className={styles.label}>
              Observacao
              <p className={styles.p}>{dependencia.observacao}</p>
            </label>
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.containerStatus}>
            {
              user.group !== "aluno" && tipo !== 'PPT' && dependencia.status !== "Desativada"  ? (
                <div className={styles.opcoesContainer}>
                  <Dropdown icone={<img src={gearIcon} className={styles.icone}/>}
                    itens={[
                      {
                        link: `atividades/`,
                        name: 'Atividades',
                        state: {ped: dependencia.id, status: dependencia.status},
                        desabilitado: !dependencia.plano_estudos
                      },
                      {
                        link: 'editar',
                        name: 'Editar PED',
                        state: dependencia.id,  
                        desabilitado: user.group !== 'gestao_escolar' ? true : !(["Criada", "Em Andamento"]).includes(dependencia.status)
                      },
                      {
                        link: setLink(dependencia.plano_estudos, 'planoEstudos'),
                        name: 'Plano de Estudos',
                        state: {ped: dependencia.id, plano_estudos: dependencia.plano_estudos, status: dependencia.status},
                        desabilitado: !(dependencia.plano_estudos) ? user.group !== 'professor' : false
                      },
                      {
                        link: setLink(dependencia.form_encerramento, 'formEncerramento'),
                        name: 'Formulário de Encerramento',
                        state: {ped: dependencia.id, form_encerramento: dependencia.form_encerramento, status: dependencia.status},
                        desabilitado: user.group !== 'professor' ? !(dependencia.form_encerramento) : !(dependencia.plano_estudos)
                      },
                    ]}
                  />
                </div>
              ) : (
                <></>
              )
            }
            <StatusBalls status={dependencia.status} />
            <div className={styles.containerBotoes}>
              {(() => {
                // Se estiver desativado: nada é renderizado
                if (["Desativada", "Finalizada"].includes(dependencia.status)) return null;

                // 1) GESTÃO ESCOLAR
                if (user.group === "gestao_escolar") {
                  return (
                    <>
                      <Button 
                        texto={`Desativar ${tipo}`} 
                        color="#a02d2dff"
                        onClick={() => {
                          setStatus("Desativada")
                          setTipoModal("acao")
                          setModalAberto(true)
                        }}
                      />
                      {
                        tipo === 'PED' ? (

                          <>
                            <Button
                              texto="Adicionar Acompanhamento"
                              onClick={() =>{
                                setTipoModal("acomp")
                                setModalAberto(true)
                              }}
                              disabled={['Lançada', 'Finalizada', 'Desativada'].includes(dependencia.status)}
                            />
                            <Button
                              texto={`Finalizar ${tipo}`}
                              disabled={dependencia.status !== "Lançada"}
                              onClick={() => {
                                setStatus("Finalizada")
                                setTipoModal("acao")
                                setModalAberto(true)
                              }}
                            />
                          </>
                        ) : null
                      }
                    </>
                  );
                }

                // 2) ALUNO / PROFESSOR (quando tipo !== 'PPT')
                if (tipo !== "PPT") {
                  if (user.group === "aluno") {
                    return (
                      <Button
                        texto="Atividades"
                        onClick={() =>
                          redirect(`atividades`, { state: {ped: dependencia.id, modalidade: modalidade} })
                        }
                      />
                    );
                  }

                  if (validarAutor() && tipo === 'PED') {
                    return (
                      <Button
                        texto="Adicionar Acompanhamento"
                        onClick={() =>
                          setModalAberto(true)
                        }
                        disabled={['Lançada', 'Finalizada', 'Desativada'].includes(dependencia.status)}
                      />
                    );
                  }
                }

                return null;
              })()}
            </div>
          </div>
          <div className={styles.acompanhamentoContainer}>
            {
              acompanhamento && user.group !== 'aluno' && tipo === 'PED' ? (
                <>
                  {prev && (
                    <button
                      className={styles.button}
                      onClick={() => setPagina(pagina - 1)}
                    >
                      <img
                        src={seta}
                        alt="anterior"
                        style={{ width: '20px', height: '20px', rotate: '90deg' }}
                      />
                    </button>
                  )}

                  <div
                    className={`${styles.acompanhamento} ${
                      acompanhamento.status === "Leve" ? styles.leve :
                      acompanhamento.status === "Moderada" ? styles.moderada :
                      acompanhamento.status === "Grave" ? styles.grave :
                      acompanhamento.status === "Gravíssima" ? styles.gravissima :
                      ""
                    }`}
                  >
                    <div className={styles.group}>
                      <Label titulo="Postada por:">
                        <p className={styles.p}>
                          {acompanhamento.autor.username}
                        </p>
                      </Label>
                      <p className={styles.p}>
                        {new Date(acompanhamento.data_criacao).toLocaleDateString("pt-BR")}
                        {
                          validarEdicao() ? (
                            <img 
                              src={editIcone} 
                              alt="Editar" 
                              style={{width:'20px', height: '20px', marginLeft: '15px', cursor: "pointer"}}
                              onClick={() => {
                                setFormData({
                                  id: acompanhamento.id,
                                  parecer: acompanhamento.parecer,
                                  ped: dependencia.id,
                                  status: acompanhamento.status
                                })

                                setTipoModal('acomp')
                                setModalAberto(true)
                              }}
                            />
                          ) : null
                        }
                      </p>
                    </div>
                    <Label titulo="Parecer">
                      <textarea
                        className={styles.textArea}
                        value={acompanhamento.parecer}
                        disabled
                        style={{ height: '100px' }} // inline override funciona
                      />
                    </Label>
                  </div>

                  {prox && (
                    <button
                      className={styles.button}
                      onClick={() => setPagina(pagina + 1)}
                    >
                      <img
                        src={seta}
                        alt="próximo"
                        style={{ width: '20px', height: '20px', rotate: '-90deg' }}
                      />
                    </button>
                  )}
                </>
              ) : null
            }
          </div>
        </div>
      </section>
      {
        modalAberto ? (
          <Modal
            setIsOpen={(aberto) => {
              if (!aberto) {
                setFormData({
                  autor: '',
                  id: '',
                  parecer: '',
                  ped: '',
                  status: 'Leve'
                });

                setModalAberto(false);
              }
            }}
          >
            {tipoModal === 'acomp' && (
              <FormContainer titulo="Novo Acompanhamento" comprimento="50%">
                <ToastContainer/>
                <form onSubmit={submit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <Label titulo="Parecer *">
                      <textarea 
                        className={styles.textArea}
                        value={formData.parecer}
                        onChange={(e) => setFormData({...formData, parecer: e.target.value})}
                      />
                      {erros.parecer && <MensagemErro mensagem={erros.parecer}/>}
                    </Label>
                  </div>

                  <div className={styles.formGroup}>
                    <Label titulo="Gravidade *">
                      <div className={styles.rangeContainer}>
                        <input
                          type="range"
                          min={0}
                          max={3}
                          step={1}
                          value={gravidadeIndex}
                          onChange={(e) => {
                            const idx = Number(e.target.value);
                            setGravidadeIndex(idx);
                            const mapping = ['Leve', 'Moderada', 'Grave', 'Gravíssima'];
                            setFormData({...formData, status: mapping[idx]});
                          }}
                          className={styles.range}
                        />

                        <div className={styles.rangeTicks}>
                          <span>Leve</span>
                          <span>Moderada</span>
                          <span>Grave</span>
                          <span>Gravíssima</span>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <Button texto={formData.id ? "Salvar" : "Cadastrar"} tipo="submit"/>
                </form>
              </FormContainer>
            )}

            {tipoModal === 'acao' && (
              <section className={styles.modalSection}>
                <p>
                  Deseja mudar o status dessa progressão para {status}?<br />
                  Essa ação é irreversível.
                </p>
                <div className={styles.containerBotoes}>
                  <Button texto="Confirmar" onClick={() => trocarStatusDependencia()}/>
                  <Button color="#a02d2dff" texto="Cancelar" onClick={() => setModalAberto(false)}/>
                </div>
              </section>
            )}
          </Modal>
        ) : null
      }
    </FormContainer>
  );
};

export default DetalhesDependencia;
