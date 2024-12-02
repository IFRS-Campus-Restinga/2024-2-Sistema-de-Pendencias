import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPED.css";
import Button from "../../../../components/Button/Button";
import StatusBalls from "../../../../components/StatusBall/StatusBall";
import Modal from "../../../../components/Modal/Modal";
import { PEDService } from "../../../../services/pedService";
import { jwtDecode } from 'jwt-decode';

const DetalhesPED = () => {
  const [detalhesPED, setDetalhesPED] = useState({});
  const { pedId } = useParams();
  const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
  const location = useLocation();
  const { state } = location || {};

  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const fetchDetalhes = async () => {
    try {
      const res = await PEDService.porId(pedId, "EMI");
      if (res.status !== 200) throw new Error(res.response?.data?.mensagem);
      setDetalhesPED(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da PED:", error.message);
    }
  };

  useEffect(() => {
    if (state) {
      setDetalhesPED(state); // Usar o 'state' se estiver disponível
    } else {
      fetchDetalhes(); // Caso contrário, buscar os dados da PED pelo ID
    }
  }, [pedId, state]);

  const handleDesativarClick = async () => {
    try {
      const updatedDetalhes = { ...detalhesPED, status: "Desativado" };
      const modalidade = state.serie_progressao ? "EMI" : "ProEJA";
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

  return (
    <FormContainer
      titulo={`Detalhes da PED - ${state.serie_progressao ? "EMI" : "ProEJA"}`}
      comprimento="60%"
    >
      {state.serie_progressao ? (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{state.aluno}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPEDEMI">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{state.professor_ped}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{state.professor_disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{state.curso}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{state.disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Trimestres a Recuperar
                <p className="pDetalhesPED">{state.trimestre_recuperar}</p>
              </label>
              <label className="labelDetalhesPED">
                Série da Progressão
                <p className="pDetalhesPED">{state.serie_progressao}</p>
              </label>
              <label className="labelDetalhesPED">
                Turma Atual
                <p className="pDetalhesPED">{state.turma_atual}</p>
              </label>
            </div>
            <div className="divStatusPEDEMI">
              <StatusBalls status={detalhesPED.status} />
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
                </Link>
                <Link to={`/sessao/Gestão Escolar/${usuarioId}/atividades/emi/${pedId}`}>
                  <Button text='Atividades'/>
                </Link>
              </span>
            </div>
          </section>
        </>
      ) : (
        <>
          <label className="labelCabecalhoDetalhesPED">
            <span className="spanDetalhesPED">
              Aluno -<p className="pDetalhesPED">{state.aluno}</p>
            </span>
            <label className="labelStatusPED">Andamento da PED</label>
          </label>
          <section className="sectionDetalhesPED">
            <div className="divDetalhesPED">
              <label className="labelDetalhesPED">
                Docente responsável pela progressão
                <p className="pDetalhesPED">{state.professor_ped}</p>
              </label>
              <label className="labelDetalhesPED">
                Docente que ministrou a disciplina
                <p className="pDetalhesPED">{state.professor_disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Curso
                <p className="pDetalhesPED">{state.curso}</p>
              </label>
              <label className="labelDetalhesPED">
                Disciplina
                <p className="pDetalhesPED">{state.disciplina}</p>
              </label>
              <label className="labelDetalhesPED">
                Ano/Semestre de Reprovação
                <p className="pDetalhesPED">{state.ano_semestre_reprov}</p>
              </label>
            </div>
            <div className="divStatusPED">
              <StatusBalls status={detalhesPED.status} tipo={"PED"} />
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
                </Link>
                <Link to={`/sessao/Gestão Escolar/${usuarioId}/atividades/proeja/${pedId}`}>
                  <Button text='Atividades'/>
                </Link>
              </span>
            </div>
          </section>
        </>
      )}

      <label className="labelDetalhesPED">
        Observação
        <p className="pDetalhesPED">{state.observacao}</p>
      </label>
      <div className="buttons-ped">
      <span className="spanDetalhesPED">
        {detalhesPED.status !== "Desativado" && (
          <>
            <Link to={"editar"} state={detalhesPED}>
              <Button text={"Editar PED"} />
            </Link>
            <Button text="Desativar PED" color={"red"} onClick={abrirModal} />
          </>
        )}
      </span>
      </div>

      <Modal
        estaAberto={modalAberto}
        aoFechar={fecharModal}
        mensagem="Você tem certeza que deseja desativar a PED?"
        textoCancelar="Não"
        textoOk="Desativar"
        colorButton={"red"}
        onClick={handleDesativarClick}
      />
    </FormContainer>
  );
};

export default DetalhesPED;
