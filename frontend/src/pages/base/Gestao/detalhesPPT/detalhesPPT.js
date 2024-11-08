import React, { useEffect, useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import { PPTService } from '../../../../services/emiPptService'
import { useParams } from "react-router-dom";

const DetalhesPPT = () => {
  // Estado do status da PPT (pode ser 'criada', 'em andamento', ou 'finalizada')
  const [status, setStatus] = useState("em andamento");
  const [detalhesPPT, setDetalhesPPT] = useState([])
  const { idPpt } = useParams()

  const fetchDetalhes = async () => {
    const res = await PPTService.getById(idPpt)

    if (res.status != 200) throw new Error(res.response.data.mensagem)

    setDetalhesPPT(res.data);
    console.log(res.data);
  }

  useEffect(() => {
    fetchDetalhes();
  }, [idPpt])

  return (
    <div className="formContainer">
      <div className="main-title">
        <h1 id="title"></h1>
      </div>

      <div className="green-bar-container">
        <div class="green-bar">
          <h2 id="aluno">Estudante: {detalhesPPT.aluno?.nome || '-'}</h2>
          <h2>Andamento da PPT</h2>
        </div>

        <StatusBalls status={detalhesPPT.status} />

        <div className="infos">
          <div className="info-item">
            <h3 className="h3-info">Matrícula:</h3>
            <span className="info-value" id="matricula">{detalhesPPT.aluno?.email.split('@')[0] || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Curso:</h3>
            <span className="info-value">{detalhesPPT.curso?.nome || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma:</h3>
            <span className="info-value">{detalhesPPT.turmaOrigem?.numero || '-'}</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma da PPT:</h3>
            <span className="info-value">{detalhesPPT.turmaProgressao?.numero || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Disciplina:</h3>
            <span className="info-value">{detalhesPPT.disciplina?.nome || '-'}</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Docente responsável:</h3>
            <span className="info-value">{detalhesPPT.professor?.email || '-'}</span>{" "}
          </div>
          <div className="info-textarea">
            <h3 className="h3-info">Observações:</h3>
            <textarea id="textarea"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPPT;
