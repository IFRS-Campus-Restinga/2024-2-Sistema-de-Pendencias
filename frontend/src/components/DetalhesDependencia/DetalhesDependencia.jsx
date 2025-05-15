import styles from "./DetalhesDependencia.module.css";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Button from "../Button/Button";
import StatusBalls from "../StatusBall/StatusBall";
import Dropdown from "../Dropdown/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DetalhesDependencia = ({ dependencia, tipo, modalidade, grupo }) => {
  const redirect = useNavigate()
  const [modalAberto, setModalAberto] = useState(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const abrirModalConfirmacao = () => setModalConfirmacaoAberto(true);
  const fecharModalConfirmacao = () => setModalConfirmacaoAberto(false);

  const setLink = (id, nome) => {
    if (id) return `${nome}/${id}`

    if (grupo === 'Professor') return `${nome}`

    return null
  }

  useEffect(() => {
    console.log(dependencia)
  }, [dependencia])

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
                <Button texto="Desativar PED" color="#f00" onClick={abrirModal} />
                <Button
                  texto="Encerrar PED"
                  onClick={abrirModalConfirmacao}
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

      {/* <Modal
        estaAberto={modalAberto}
        aoFechar={fecharModal}
        mensagem="Você tem certeza que deseja desativar a PED?"
        textoCancelar="Não"
        textoOk="Desativar"
        colorButton={"red"}
        onClick={handleDesativarClick}
      />

      <Modal
        estaAberto={modalConfirmacaoAberto}
        aoFechar={fecharModalConfirmacao}
        mensagem="Você tem certeza que deseja encerrar a PED? Essa ação é irreversível."
        textoCancelar="Não"
        textoOk="Encerrar"
        colorButton={"red"}
        onClick={async () => {
          fecharModalConfirmacao();
          await handleEncerrarClick();
        }}
      /> */}

    </FormContainer>
  );
};

export default DetalhesDependencia;
