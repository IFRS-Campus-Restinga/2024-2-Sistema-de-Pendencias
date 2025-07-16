import styles from "./DetalhesDependencia.module.css";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Button from "../Button/Button";
import StatusBalls from "../StatusBall/StatusBall";
import Dropdown from "../Dropdown/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from '../Modal/Modal'
import { PEDService } from "../../services/pedService";
import { PPTService } from "../../services/pptService";
import { toast } from "react-toastify";

const DetalhesDependencia = ({ dependencia, tipo, modalidade, grupo }) => {
  const redirect = useNavigate()
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false)
  const [modalAberto, setModalAberto] = useState(false);

  const setLink = (id, nome) => {
    if (id) return `${nome}/${id}`

    if (grupo === 'Professor') return `${nome}`

    return null
  }

  const desativarDependencia = async () => {
    let req

    setBotaoDesabilitado(true)

    if (tipo === 'PED') req = PEDService.desativar(modalidade, dependencia.id)
    if (tipo === 'PPT') req = PPTService.trocarStatus(dependencia.id, { status: 'Desativada' })

    toast.promise(
      (async () => {
        const res = await req;

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(JSON.stringify(["Erro ao desativar progressão"]));
        }

        return res;
      })(),
      {
        pending: 'Desativando progressão...',
        success: 'Progressão desativada com sucesso!',
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

                return 'Erro ao desativar progressão.';
              } catch (e) {
                return 'Erro inesperado ao processar mensagens.';
              }
            }

            return 'Erro ao desativar progressão.';
          }
        }
      },
      {
        autoClose: 3000,
        position: 'bottom-center',
        style: { textAlign: 'center', whiteSpace: 'pre-line' }
      }
    );

    setBotaoDesabilitado(false)
  }

  return (
    <FormContainer
      titulo={`Detalhes da ${tipo} - ${modalidade}`}
      comprimento="80%"
    >
      <label className={styles.cabecalho}>
        <span className={styles.span}>
          Aluno - <p className={styles.nomeAluno}>{dependencia.aluno}</p>
        </span>
        <label className={styles.status}>Andamento da PED</label>
      </label>
      <section className={styles.section}>
        <div className={styles.div}>
          <span className={styles.dados}>
            <label className={styles.label}>
              Docente responsável pela progressão
              {
                dependencia.professores.map((professor) => (
                  <ul className={styles.ul}>
                    <li className={styles.li}>
                      {professor.nome}
                      {
                        professor.responsavel_atual ? (
                          <p className={styles.resp}>Resp. Atual</p>
                        ) : null
                      }
                    </li>
                  </ul>
                ))
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
              <p className={styles.p}>{dependencia.curso}</p>
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
                  Ano/Semestre de Reprovação
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
              Observação
              <p className={styles.p}>{dependencia.observacao}</p>
            </label>
          </span>
        </div>
        <div className={styles.containerStatus}>
          {
            grupo !== "Aluno" ? (
              <div className={styles.opcoesContainer}>
                <Dropdown tipo={'icone'} icone={<FontAwesomeIcon icon={faGear} color="black" size="xl" />}
                  itens={[
                    {
                      link: `atividades/`,
                      name: 'Atividades',
                      state: dependencia,
                      desabilitado: !dependencia.plano_estudos
                    },
                    {
                      link: 'editar',
                      name: 'Editar PED',
                      state: dependencia.id,
                      desabilitado: grupo !== 'Gestão Escolar'
                    },
                    {
                      link: setLink(dependencia.plano_estudos?.id, 'planoEstudos'),
                      name: 'Plano de Estudos',
                      state: dependencia,
                      desabilitado: !(dependencia.plano_estudos) ? grupo !== 'Professor' : false
                    },
                    {
                      link: setLink(dependencia.form_encerramento, 'formEncerramento'),
                      name: 'Formulário de Encerramento',
                      state: dependencia,
                      desabilitado: !(dependencia.form_encerramento) ? grupo !== 'Professor' : false
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
            {dependencia.status !== "Desativado" && grupo === 'Gestão Escolar' ? (
              <>
                <Button texto="Desativar PED" color="#f00" />
                <Button
                  texto="Encerrar PED"
                  disabled={dependencia.status !== "Finalizada"}
                  title={dependencia.status !== "Finalizada" ? "A PED precisa estar 'Finalizada' para ser encerrada." : ""}
                />
              </>
            ) : (
              grupo === 'Aluno' && tipo !== 'PPT' ? (
                <Button texto={"Atividades"} onClick={() => redirect(`atividades`, { state: dependencia })} disabled={!dependencia.plano_estudos} />
              ) : (<></>)
            )
            }
          </div>
        </div>
      </section>
    </FormContainer>
  );
};

export default DetalhesDependencia;
