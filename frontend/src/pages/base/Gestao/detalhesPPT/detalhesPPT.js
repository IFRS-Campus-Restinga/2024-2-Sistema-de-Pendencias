import React, { useState } from "react";
import "./detalhesPPT.css";
import StatusBalls from "../../../../components/StatusBall/StatusBall";

const DetalhesPPT = () => {
  // Estado do status da PPT (pode ser 'criada', 'em andamento', ou 'finalizada')
  const [status, setStatus] = useState("em andamento");

  return (
    <div className="formContainer">
      <div className="main-title">
        <h1 id="title">Detalhes PPT</h1>
      </div>

      <div className="green-bar-container">
        <div class="green-bar">
          <h2>Estudante: Kayane Vieira Bottona</h2>
          <h2>Andamento da PPT</h2>
        </div>

        <StatusBalls status={status} />

        <div className="infos">
          <div className="info-item">
            <h3 className="h3-info">Matrícula:</h3>
            <span className="info-value">220219382</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Curso:</h3>
            <span className="info-value">Análise e Desenvolvimento de Sistemas</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma:</h3>
            <span className="info-value">101</span>
          </div>
          <div className="info-item">
            <h3 className="h3-info">Turma da PPT:</h3>
            <span className="info-value">202</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Disciplina:</h3>
            <span className="info-value">Matemática Discreta</span>{" "}
          </div>
          <div className="info-item">
            <h3 className="h3-info">Docente responsável:</h3>
            <span className="info-value">Prof. João Silva</span>{" "}
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
