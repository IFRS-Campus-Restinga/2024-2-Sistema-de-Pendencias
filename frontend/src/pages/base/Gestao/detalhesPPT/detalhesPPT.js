import React, { useEffect, useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PPTService } from '../../../../services/emiPptService'
import { useParams } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal"

const DetalhesPPT = () => {
  // Estado do status da PPT (pode ser 'criada', 'em andamento', ou 'finalizada')
  const [status, setStatus] = useState("Em Andamento");
  const [detalhesPPT, setDetalhesPPT] = useState([])
  const { idPpt } = useParams()
  const navigate = useNavigate();

  const fetchDetalhes = async () => {
    const res = await PPTService.getById(idPpt)

    if (res.status != 200) throw new Error(res.response.data.mensagem)

    setDetalhesPPT(res.data);
    console.log(res.data);
  }

  const handleEditarClick = () => {
    console.log(detalhesPPT);
    navigate(`/sessao/GestaoEscolar/2/detalhesPPT/${idPpt}/editarPPT`, {
      state: { ppt: detalhesPPT } // Passando os dados da PPT via state
    });
  };

  const handleDesativarClick = async () => {
    console.log(detalhesPPT);
    detalhesPPT.status = 'Desativado';
    const res = await PPTService.desativar(idPpt, detalhesPPT)

    if (res != true) throw new Error(res.response?.data?.mensagem)

    setDetalhesPPT(detalhesPPT);
    console.log(detalhesPPT);

    fecharModal();
  };

  const [modalAberto, setModalAberto] = useState(false);

  // Função para abrir o modal
  const abrirModal = () => {
    setModalAberto(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setModalAberto(false);
  };

  useEffect(() => {
    fetchDetalhes();
  }, [idPpt])

  return (
    <div className="formContainerDetails">
      <div className="main-title">
        <h1 id="title"></h1>
      </div>

      <div className="green-bar-container">
        <div class="green-bar">
          <h2>Andamento da PPT</h2>
        </div>

        <StatusBalls status={detalhesPPT.status} />

        <div className="infos">
          <div className="info-item">
            <h3 className="h3-info">Matrícula:</h3>
            <span className="info-value" id="matricula">{detalhesPPT.aluno?.split('@')[0] || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Curso:</h3>
            <span className="info-value">{detalhesPPT.curso || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma:</h3>
            <span className="info-value">{detalhesPPT.turma_origem || '-'}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma da PPT:</h3>
            <span className="info-value">{detalhesPPT.turma_progressao || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Disciplina:</h3>
            <span className="info-value">{detalhesPPT.disciplina || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Docente responsável:</h3>
            <span className="info-value">{detalhesPPT.professor_disciplina || '-'}</span>{" "}
          </div>
          <div className="info-textarea">
            <h3 className="h3-info">Observações:</h3>
            <textarea id="textarea" value={detalhesPPT.observacao} disabled='true'></textarea>
          </div>
        </div>
      </div>
      <div className="buttons">
        {/* Verificar se o status da PPT não é 'Desativado' para exibir os botões */}
        {detalhesPPT.status !== 'Desativado' && (
          <>
            <Button tipo={'submit'} text="Desativar PPT" color={"red"} onClick={abrirModal} />
            <Button tipo={'submit'} text="Editar PPT" onClick={handleEditarClick} />
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
