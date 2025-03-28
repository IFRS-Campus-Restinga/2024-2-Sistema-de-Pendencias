import "./DetalhesDependencia.css";
import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import Button from "../Button/Button";
import StatusBalls from "../StatusBall/StatusBall";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DetalhesDependencia = ({dependencia, tipo, modalidade, grupo}) => {
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

  return (
    <FormContainer
      titulo={`Detalhes da ${tipo} - ${modalidade}`}
      comprimento="80%"
    >
      <label className="labelCabecalhoDetalhesDependencia">
        <span className="spanDetalhesDependencia">
          Aluno - <p className="nomeAlunoPED">{dependencia.aluno.nome}</p>
        </span>
        <label className="labelStatusPED">Andamento da PED</label>
      </label>
      <section className="sectionDetalhesDependencia">
        <div className="divDetalhesDependencia">
          <span className="dadosPED">
            <label className="labelDetalhesDependencia">
              Docente responsável pela progressão
              <p className="pDetalhesDependencia">{dependencia.professor_ped?.nome || dependencia.professor_ppt?.nome}</p>
            </label>
            <label className="labelDetalhesDependencia">
              Docente que ministrou a disciplina
              <p className="pDetalhesDependencia">{dependencia.professor_disciplina.nome}</p>
            </label>
          </span>
          <span className="dadosPED">
            <label className="labelDetalhesDependencia">
              Curso
              <p className="pDetalhesDependencia">{dependencia.curso.nome}</p>
            </label>
            <label className="labelDetalhesDependencia">
              Disciplina
              <p className="pDetalhesDependencia">{dependencia.disciplina.nome}</p>
            </label>
          </span>
          <span className="dadosPED">
          {
            modalidade === 'Integrado' ? (
              <>
                <label className="labelDetalhesDependencia">
                  Trimestres a Recuperar
                  <p className="pDetalhesDependencia">{dependencia.trimestre_recuperar}</p>
                </label>
                <label className="labelDetalhesDependencia">
                  Série da Progressão
                  <p className="pDetalhesDependencia">{dependencia.serie_progressao}</p>
                </label>
                <label className="labelDetalhesDependencia">
                  Turma Atual
                  <p className="pDetalhesDependencia">{dependencia.turma_atual.numero}</p>
                </label>
              </>
            ) : modalidade === 'ProEJA' ? (
              <label className="labelDetalhesDependencia">
                Ano/Semestre de Reprovação
                <p className="pDetalhesDependencia">{dependencia.ano_semestre_reprov}</p>
              </label>
            ) : (
              <>
                <label className="labelDetalhesDependencia">
                  Turma Atual
                  <p className="pDetalhesDependencia">{dependencia.turma_atual.numero}</p>
                </label><label className="labelDetalhesDependencia">
                  Turma da Progressão
                  <p className="pDetalhesDependencia">{dependencia.turma_progressao.numero}</p>
                </label>
              </>
            )
          }
            <label className="labelDetalhesDependencia">
            Observação
            <p className="pDetalhesDependencia">{dependencia.observacao}</p>
          </label>
          </span>
        </div>
        <div className="divStatusPED">
            {
              grupo !== "Aluno" ? (
                <div className="opcoesContainer">
                  <Dropdown tipo={'icone'} icone={<FontAwesomeIcon icon={faGear} color="black" size="xl"/>}
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
                      state: dependencia,
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
          <div className="buttons-ped">
            {dependencia.status !== "Desativado" && grupo === 'Gestão Escolar' ? (
              <>
                <Button text="Desativar PED" color="#f00" onClick={abrirModal} />
                <Button
                  text="Encerrar PED"
                  onClick={abrirModalConfirmacao}
                  disabled={dependencia.status !== "Finalizada"}
                  title={dependencia.status !== "Finalizada" ? "A PED precisa estar 'Finalizada' para ser encerrada." : ""}
                />
              </>
            ) : (
              grupo === 'Aluno' && tipo !== 'PPT' ? (
                <Button text={"Atividades"} onClick={() => redirect(`atividades`, {state: dependencia})} disabled={!dependencia.plano_estudos}/>
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
