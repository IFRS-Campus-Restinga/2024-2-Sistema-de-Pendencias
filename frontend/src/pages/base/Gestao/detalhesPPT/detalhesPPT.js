import React, { useEffect, useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PPTService } from "../../../../services/emiPptService";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";

const DetalhesPPT = () => {
  const [status, setStatus] = useState("Em Andamento");
  const [detalhesPPT, setDetalhesPPT] = useState({});
  const { idPpt } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);

  // Busca os detalhes da PPT pelo ID
  const fetchDetalhes = async () => {
    try {
      const res = await PPTService.getById(idPpt);
      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);
      setDetalhesPPT(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da PPT:", error.message);
    }
  };

  const handleEditarClick = () => {
    console.log("Detalhes enviados para edição:", detalhesPPT);
    navigate(`editarPPT/`, {
      state: {
        id: detalhesPPT.id,
        aluno: detalhesPPT.aluno,
        professor_ppt: detalhesPPT.professor_ppt,
        professor_disciplina: detalhesPPT.professor_disciplina,
        curso: detalhesPPT.curso,
        disciplina: detalhesPPT.disciplina,
        turma_origem: detalhesPPT.turma_origem,
        turma_progressao: detalhesPPT.turma_progressao,
        observacao: detalhesPPT.observacao,
      },
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
  }, [idPpt]);

  return (
    <div className="formContainerDetails">
      <div className="main-title">
        <h1>Detalhes da PPT</h1>
      </div>

      <div className="green-bar-container">
        <div className="green-bar">
          <h2>Andamento da PPT</h2>
        </div>

        <StatusBalls status={detalhesPPT.status} />

        <div className="infos">
          <div className="info-item">
            <h3 className="h3-info">Matrícula:</h3>
            <span className="info-value">
              {detalhesPPT.aluno?.split("@")[0] || "-"}
            </span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Curso:</h3>
            <span className="info-value">{detalhesPPT.curso || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma:</h3>
            <span className="info-value">
              {detalhesPPT.turma_origem || "-"}
            </span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma da PPT:</h3>
            <span className="info-value">
              {detalhesPPT.turma_progressao || "-"}
            </span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Disciplina:</h3>
            <span className="info-value">{detalhesPPT.disciplina || "-"}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Docente responsável:</h3>
            <span className="info-value">
              {detalhesPPT.professor_disciplina || "-"}
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
