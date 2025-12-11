import styles from "./DetalhesDependencia.module.css";
import { useEffect, useState } from "react";
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

const DetalhesDependencia = ({ dependencia, tipo, modalidade, grupo }) => {
  const redirect = useNavigate()
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

    if (grupo === 'professor') return `${nome}`

    return null
  }

  const trocarStatusDependencia = async () => {
    let req

    setBotaoDesabilitado(true)

    if (tipo === 'PED') req = PEDService.trocarStatus(modalidade, dependencia.id, status)
    if (tipo === 'PPT') req = PPTService.trocarStatus(dependencia.id, status)

    toast.promise(
      (async () => {
        const res = await req;

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(JSON.stringify(["Erro ao desativar progressão"]));
        }

        return res;
      })(),
      {
        pending: `Atualizando status da progressão para ${status}...`,
        success: 'Status alterado com sucesso!',
        error: {
          render({ data }) {
            if (data instanceof Error) {
              try {
                const mensagens = JSON.parse(data.message);

                if (Array.isArray(mensagens)) {
                  mensagens.forEach((mensagem, index) => {
                    if (index > 0) {
                      toast.error(mensagem, {
                        autoClose: 3000,
                        position: 'bottom-center',
                        style: { textAlign: 'center', whiteSpace: 'pre-line' },
                      });
                    }
                  });

                  return mensagens[0];
                }

                return 'Erro ao atualizar status da progressão.';
              } catch (e) {
                return 'Erro inesperado ao processar mensagens.';
              }
            }

            return 'Erro ao atualizar status da progressão.';
          }
        }
      },
    ).then((res) => {
      if (res.status == 200) setModalAberto(false)
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
              if (res.status === 201 || res.status === 200) fetchAcompanhamento()
            })

    }
  }

  const fetchAcompanhamento = async () => {
    try {
      const res = await AcompanhamentoService.listar(modalidade, dependencia.id, pagina)

      setAcompanhamento(res.data.results[0])
      setProx(res.data.next ? pagina + 1 : null)
      setPrev(res.data.previous ? pagina - 1 : null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const validarAutor = () => {
    const usuario = JSON.parse(sessionStorage.getItem('user'))

    if (grupo === 'gestao_escolar') return true

    if (grupo === 'coord' && dependencia.curso.coord === usuario.id) return true

    if (
      grupo === 'professor' &&
      dependencia.professores?.some(
        (professor) =>
          professor.id === usuario.id && professor.resp_atual === true
      )
    ) {
      return true;
    }

    return false
  }

  const validarEdicao = () => {
    const usuario = JSON.parse(sessionStorage.getItem('user'))

    if (acompanhamento.autor.id === usuario.id && ['Criada', 'Em Andamento'].includes(dependencia.status)) return true
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
              grupo !== "aluno" && tipo !== 'PPT' && dependencia.status !== "Desativada" ? (
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
                        desabilitado: grupo !== 'gestao_escolar' ? true : !(["Criada", "Em Andamento"]).includes(dependencia.status)
                      },
                      {
                        link: setLink(dependencia.plano_estudos, 'planoEstudos'),
                        name: 'Plano de Estudos',
                        state: {ped: dependencia.id, plano_estudos: dependencia.plano_estudos, status: dependencia.status},
                        desabilitado: !(dependencia.plano_estudos) ? grupo !== 'professor' : false
                      },
                      {
                        link: setLink(dependencia.form_encerramento, 'formEncerramento'),
                        name: 'Formulário de Encerramento',
                        state: {ped: dependencia.id, form_encerramento: dependencia.form_encerramento, status: dependencia.status},
                        desabilitado: grupo !== 'professor' ? !(dependencia.form_encerramento) : false
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
                if (dependencia.status === "Desativada") return null;

                // 1) GESTÃO ESCOLAR
                if (grupo === "gestao_escolar") {
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
                  );
                }

                // 2) ALUNO / PROFESSOR (quando tipo !== 'PPT')
                if (tipo !== "PPT") {
                  if (grupo === "aluno") {
                    return (
                      <Button
                        texto="Atividades"
                        onClick={() =>
                          redirect(`atividades`, { state: {ped: dependencia.id, modalidade: modalidade} })
                        }
                      />
                    );
                  }

                  if (validarAutor()) {
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
              acompanhamento && grupo !== 'aluno' ? (
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
