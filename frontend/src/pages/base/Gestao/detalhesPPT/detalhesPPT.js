import React, { useEffect, useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PPTService } from "../../../../services/emiPptService";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import loading from '../../../../assets/loading-disciplinas.png'
import FormContainer from "../../../../components/FormContainer/FormContainer";

const DetalhesPPT = () => {
  const { idPpt } = useParams();
  const navigate = useNavigate();
  const [detalhesPPT, setDetalhesPPT] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false);

  const fetchDetalhes = async () => {
    try {
      const res = await PPTService.getById(idPpt, 'detalhes');

      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);

      setDetalhesPPT(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar detalhes da PPT:", error.message);
    }
  };

  const handleEditarClick = () => {
    navigate(`editar/`, {
      state: detalhesPPT
    });
  };

  const handleDesativarClick = async () => {
    try {
      const updatedDetalhes = { ...detalhesPPT, status: "Desativado" };
      const res = await PPTService.desativar(idPpt, updatedDetalhes);
      if (!res) throw new Error(res.response?.data?.mensagem);
      setDetalhesPPT(updatedDetalhes);
      console.log("PPT desativada com sucesso:", updatedDetalhes);
      fecharModal();
    } catch (error) {
      console.error("Erro ao desativar PPT:", error.message);
    }
  };

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  useEffect(() => {
    fetchDetalhes();
  }, []);

  if (isLoading) return <LoadingIFRS icone={loading}/>

    return (
      <>  
        <FormContainer
          titulo={`Detalhes da PPT`}
          comprimento="80%"
        >
          <label className="labelCabecalhoDetalhesPPT">
            <span className="spanDetalhesPPT">
              Aluno - <p className="nomeAlunoPED">{detalhesPPT.aluno.nome}</p>
            </span>
            <label className="labelStatusPED">Andamento da PPT</label>
          </label>
          <section className="sectionDetalhesPPT">
            <div className="divDetalhesPPT">
              <span className="dadosPED">
                <label className="labelDetalhesPPT">
                  Docente responsável pela progressão
                  <p className="pDetalhesPPT">{detalhesPPT.professor_ppt.nome}</p>
                </label>
                <label className="labelDetalhesPPT">
                  Docente que ministrou a disciplina
                  <p className="pDetalhesPPT">{detalhesPPT.professor_disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPPT">
                  Curso
                  <p className="pDetalhesPPT">{detalhesPPT.curso.nome}</p>
                </label>
                <label className="labelDetalhesPPT">
                  Disciplina
                  <p className="pDetalhesPPT">{detalhesPPT.disciplina.nome}</p>
                </label>
              </span>
              <span className="dadosPED">
                <label className="labelDetalhesPPT">
                  Turma Atual
                  <p className="pDetalhesPPT">{detalhesPPT.turma_atual.numero}</p>
                </label>
                <label className="labelDetalhesPPT">
                  Turma da Progressão
                  <p className="pDetalhesPPT">{detalhesPPT.turma_progressao.numero}</p>
                </label>
                <label className="labelDetalhesPPT">
                  Observação
                  <p className="pDetalhesPPT">{detalhesPPT.observacao}</p>
                </label>
              </span>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={detalhesPPT.status} />
              <div className="buttons-ped">
                {detalhesPPT.status !== "Desativado" && (
                  <Button text="Desativar PPT" color="#f00" onClick={abrirModal} />
                )}
              </div>
            </div>
          </section>
        </FormContainer>
        <Modal
          estaAberto={modalAberto}
          aoFechar={fecharModal}
          mensagem="Você tem certeza que deseja desativar o PPT?"
          textoCancelar="Não"
          textoOk="Desativar"
          colorButton={"red"}
          onClick={handleDesativarClick}
          />
        </>
    )
};

export default DetalhesPPT;
