import React, { useEffect, useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PPTService } from "../../../../services/emiPptService";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import loading from '../../../../assets/loading-disciplinas.png'

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
    <div className="formContainerDetails">
      <div className="main-title">
        <h1>Detalhes da PPT</h1>
      </div>

      <div className="green-bar-container">
        <div className="green-bar">
          <h2>Andamento da PPT</h2>
        </div>
        <div className="mainContent">

        <div className="infos">
          <div className="info-item">
            <h3 className="h3-info">Matrícula:</h3>
            <span className="info-value">{detalhesPPT.aluno.nome || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Curso:</h3>
            <span className="info-value">{detalhesPPT.curso.nome || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma:</h3>
            <span className="info-value">{detalhesPPT.turma_atual.numero || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma da PPT:</h3>
            <span className="info-value">
              {detalhesPPT.turma_progressao.numero || "-"}
            </span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Disciplina:</h3>
            <span className="info-value">{detalhesPPT.disciplina.nome || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Docente responsável:</h3>
            <span className="info-value">
              {detalhesPPT.professor_disciplina.nome || "-"}
            </span>
          </div>
          <div className="info-textarea">
            <h3 className="h3-info">Observações:</h3>
            <textarea
              id="textarea"
              value={detalhesPPT.observacao || ""}
              disabled
            />
          </div>
        </div>
        <div className="statusPPT">
          <StatusBalls status={detalhesPPT.status} aparecerLancado={true}/>
        </div>
        </div>
      </div>

      <div className="buttons">
        {detalhesPPT.status !== "Desativado" && (
          <>
            <Button
              tipo={"submit"}
              text="Desativar PPT"
              color={"red"}
              onClick={abrirModal}
            />
            <Button
              tipo={"submit"}
              text="Editar PPT"
              onClick={handleEditarClick}
            />
          </>
        )}
      </div>

      <Modal
        estaAberto={modalAberto}
        aoFechar={fecharModal}
        mensagem="Você tem certeza que deseja desativar o PPT?"
        textoCancelar="Não"
        textoOk="Desativar"
        colorButton={"red"}
        onClick={handleDesativarClick}
      />
    </div>
  );
};

export default DetalhesPPT;
