import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPED.css";
import Button from "../../../../components/Button/Button";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import Modal from "../../../../components/Modal/Modal";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const DetalhesPED = () => {
  const { pedId } = useParams();
  const location = useLocation();
  const tipoPed = location.pathname.split('/')[4];
  const [planoId, setPlanoId] = useState(null)
  const [formEncerramentoId, setFormEncerramentoId] = useState(null)
  const [detalhesPED, setDetalhesPED] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);


  const abrirModalConfirmacao = () => setModalConfirmacaoAberto(true);
  const fecharModalConfirmacao = () => setModalConfirmacaoAberto(false);

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, tipoPed === 'peds-emi' ? 'Integrado':'ProEJA', "detalhes");

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);

      setDetalhesPED(res.data);
      setPlanoId(res.data.plano_estudos)
      setFormEncerramentoId(res.data.form_encerramento)
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  const handleDesativarClick = async () => {
    try {
      const updatedDetalhes = { ...detalhesPED, status: "Desativado" };
      const modalidade = detalhesPED.serie_progressao ? "EMI" : "ProEJA";
      const res = await PEDService.desativar(
        pedId,
        updatedDetalhes,
        modalidade
      );
      if (!res) throw new Error(res.response?.data?.mensagem);
      setDetalhesPED(updatedDetalhes);
      console.log("PED desativada com sucesso:", updatedDetalhes);
      fecharModal();
    } catch (error) {
      console.error("Erro ao desativar PED:", error.message);
    }
  };

  const handleEncerrarClick = async () => {
    try {
      if (detalhesPED.status !== "Finalizada") {
        toast.error("Somente PEDs Finalizadas podem ser encerradas.");
        return;
      }
  
      const modalidade = detalhesPED.serie_progressao ? "emi" : "proeja";
      const res = await PEDService.encerrar_ped({
        ped_tipo: modalidade,
        ped_id: pedId
      });
  
      if (res.status !== 200) {
        throw new Error(res.response?.data?.mensagem || "Erro ao encerrar PED.");
      }
  
      setDetalhesPED({ ...detalhesPED, status: "Encerrado" });
      toast.success("PED encerrada com sucesso!");
    } catch (error) {
      toast.error(`Erro ao encerrar PED: ${error.message}`);
    }
  };
  
  useEffect(() => {
    fetchDetalhes()
  }, [])

  if (!detalhesPED.aluno) {
    return <div>Carregando...</div>;
  }

  return (
  <>  
    <ToastContainer />
    <FormContainer
      titulo={`Detalhes da PED - ${detalhesPED.serie_progressao ? "EMI" : "ProEJA"}`}
      comprimento="80%"
    >
      {detalhesPED.serie_progressao ? (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno - <p className="nomeAlunoPED">{detalhesPED.aluno.nome}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Docente responsável pela progressão
                  <p className="pDetalhesPED">{detalhesPED.professor_ped.nome}</p>
                </label>
                <label className="labelDetalhesPED">
                  Docente que ministrou a disciplina
                  <p className="pDetalhesPED">{detalhesPED.professor_disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Curso
                  <p className="pDetalhesPED">{detalhesPED.curso.nome}</p>
                </label>
                <label className="labelDetalhesPED">
                  Disciplina
                  <p className="pDetalhesPED">{detalhesPED.disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Trimestres a Recuperar
                  <p className="pDetalhesPED">{detalhesPED.trimestre_recuperar}</p>
                </label>
                <label className="labelDetalhesPED">
                  Série da Progressão
                  <p className="pDetalhesPED">{detalhesPED.serie_progressao}</p>
                </label>
                <label className="labelDetalhesPED">
                  Turma Atual
                  <p className="pDetalhesPED">{detalhesPED.turma_atual.numero}</p>
                </label>
                <label className="labelDetalhesPED">
                  Observação
                  <p className="pDetalhesPED">{detalhesPED.observacao}</p>
                </label>
              </span>
            </div>
            <div className="divStatusPED">
              <div className="opcoesContainer">
                <Dropdown tipo={'icone'} icone={<FontAwesomeIcon icon={faGear} color="black" size="xl"/>}
                  itens={[
                    {
                      link: 'editar',
                      name: 'Editar PED'
                    },
                    {
                      link: `/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/atividades/emi/${pedId}`,
                      name: 'Atividades'
                    },
                    {
                      link: planoId ? `planoEstudos/${planoId}/detalhes` : null,
                      name: 'Plano de Estudos',
                      desabilitado: planoId ? false : true
                    },
                    {
                      link: formEncerramentoId ? `formEncerramento/${formEncerramentoId}/detalhes` : null,
                      name: 'Formulário de Encerramento',
                      desabilitado: formEncerramentoId ? false : true
                    },
                  ]}
                />
              </div>
              <StatusBalls status={detalhesPED.status} />
              <div className="buttons-ped">
                {detalhesPED.status !== "Desativado" && (
                  <>
                    <Button text="Desativar PED" color="#f00" onClick={abrirModal} />
                    <Button
                      text="Encerrar PED"
                      onClick={abrirModalConfirmacao}
                      disabled={detalhesPED.status !== "Finalizada"}
                      title={detalhesPED.status !== "Finalizada" ? "A PED precisa estar 'Finalizada' para ser encerrada." : ""}
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{detalhesPED.aluno.nome}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Docente responsável pela progressão
                  <p className="pDetalhesPED">{detalhesPED.professor_ped.nome}</p>
                </label>
                <label className="labelDetalhesPED">
                  Docente que ministrou a disciplina
                  <p className="pDetalhesPED">{detalhesPED.professor_disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Curso
                  <p className="pDetalhesPED">{detalhesPED.curso.nome}</p>
                </label>
                <label className="labelDetalhesPED">
                  Disciplina
                  <p className="pDetalhesPED">{detalhesPED.disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPED">
                  Ano/Semestre de Reprovação
                  <p className="pDetalhesPED">{detalhesPED.ano_semestre_reprov}</p>
                </label>
                <label className="labelDetalhesPED">
                  Observação
                  <p className="pDetalhesPED">{detalhesPED.observacao}</p>
                </label>
              </span>
            </div>
            <div className="divStatusPED">
              <div className="opcoesContainer">
                <Dropdown tipo={'icone'} icone={<FontAwesomeIcon icon={faGear} color="black" size="xl"/>}
                  itens={[
                    {
                      link: 'editar',
                      name: 'Editar PED'
                    },
                    {
                      link: `/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/atividades/emi/${pedId}`,
                      name: 'Atividades'
                    },
                    {
                      link: planoId ? `planoEstudos/${planoId}/detalhes` : null,
                      name: 'Plano de Estudos',
                      desabilitado: planoId ? false : true
                    },
                    {
                      link: formEncerramentoId ? `formEncerramento/${formEncerramentoId}/detalhes` : null,
                      name: 'Formulário de Encerramento',
                      desabilitado: formEncerramentoId ? false : true
                    },
                  ]}
                />
              </div>
              <StatusBalls status={detalhesPED.status} />
              <div className="buttons-ped">
                {detalhesPED.status !== "Desativado" && (
                  <>
                    <Button text="Desativar PED" color="#f00" onClick={abrirModal} />
                    <Button
                      text="Encerrar PED"
                      color={"red"}
                      onClick={abrirModalConfirmacao}
                      disabled={detalhesPED.status === "Finalizada" ? true : false}
                      title={detalhesPED.status !== "Finalizada" ? "A PED precisa estar 'Finalizada' para ser encerrada." : ""}
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <Modal
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
      />
    </FormContainer>
    </>
  );
};

export default DetalhesPED;
