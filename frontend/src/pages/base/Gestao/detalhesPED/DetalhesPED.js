import { Link, useLocation } from "react-router-dom";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import "./DetalhesPED.css";
import Button from "../../../../components/Button/Button";
import StatusBalls from "../../../../components/StatusBall/StatusBall";

const DetalhesPED = () => {
  const location = useLocation();
  const { state } = location || {};

  return (
    <FormContainer
      titulo={`Detalhes da PED - ${state.serie_progressao ? "EMI" : "ProEJA"}`}
      comprimento="90%"
    >
      {state.serie_progressao ? (
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
            <div className="divStatusPED">
              <StatusBalls status={state.status}/>
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
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
              <StatusBalls status={state.status} tipo={"PED"} />
              <span className="spanDetalhesPED">
                <Link to={"planoEstudos"}>
                  <Button text="Plano de Estudos" />
                </Link>
                <Link to={"cadastrar-form-encerramento"}>
                  <Button text="Formulário de Encerramento" />
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
      <span className="spanDetalhesPED">
        <Link to={"editar"} state={state}>
          <Button text={"Editar PED"} />
        </Link>
      </span>
    </FormContainer>
  );
};

export default DetalhesPED;
