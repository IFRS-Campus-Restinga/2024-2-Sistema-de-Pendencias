import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import { ToastContainer, toast } from "react-toastify";
import "./cadastroPPT.css";
import { PPTService } from "../../../../services/emiPptService";
import { cursoService } from "../../../../services/cursoService";
import { validarFormularioPPT, validarTurmas } from "./validacoes";
import { usuarioBaseService } from "../../../../services/usuarioBaseService";

const CadastroPPT = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {}; // Dados enviados via navegação
  const isEditing = Boolean(state); // Se state existe, estamos editando
  console.log("State recebido no CadastroPPT: ", state);
  console.log("Modo de edição (isEditing): ", isEditing);

  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [opcoesAlunos, setOpcoesAlunos] = useState([]);
  const [opcoesProfessores, setOpcoesProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);

  const [formData, setFormData] = useState({
    aluno_id: '',
    professor_disciplina_id: '',
    professor_ppt_id: '',
    curso_id: '',
    disciplina_id: '',
    turma_origem: '',
    turma_progressao: '',
    observacao: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state) {
      setFormData({
        aluno_id: state.aluno,
        professor_disciplina_id: state.professor_disciplina || '',
        professor_ppt_id: state.professor_ppt || '',
        curso_id: state.curso || '',
        disciplina_id: state.disciplina || '',
        turma_origem: state.turma_origem || '',
        turma_progressao: state.turma_progressao || '',
        observacao: state.observacao || '',
      });
    }
  }, [state]);

  console.log("Dados iniciais do formulário: ", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const erros = validarFormularioPPT(formData);
    const erroTurmas = validarTurmas(
      turmas.find((turma) => formData.turma_origem_id === turma.id),
      turmas.find((turma) => formData.turma_progressao_id === turma.id)
    );

    if (Object.keys(erros).length !== 0 || erroTurmas) {
      erros.turmas = erroTurmas;
      setErrors(erros);
    } else {
      try {
        const res = isEditing
          ? await PPTService.editar(state.id, formData) // Atualiza PPT
          : await PPTService.create(formData); // Cadastra PPT

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.response.data.mensagem);
        }

        toast.success(
          isEditing
            ? "Progressão em Turma atualizada com sucesso!"
            : "Progressão em Turma cadastrada com sucesso!",
          {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: "#28A745", color: "#fff", textAlign: "center" },
            progressStyle: { backgroundColor: "#fff" },
          }
        );

        setFormData({
          aluno_id: "",
          professor_disciplina_id: "",
          professor_ppt_id: "",
          curso_id: "",
          disciplina_id: "",
          turma_origem_id: "",
          turma_progressao_id: "",
          observacao: "",
        });

        formRef.current.reset();
        navigate("/sessao/gestaoPPT/lista");
      } catch (error) {
        console.error("Erro ao salvar PPT: ", error);
        toast.error("Erro ao salvar PPT. Verifique os dados e tente novamente.");
      }
    }
  };

  const fetchCursos = async () => {
    if (cursos.length > 0) return;
    try {
      const res = await cursoService.porModalidade("Integrado");
      setCursos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlunos = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, "Aluno");
      setOpcoesAlunos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfessores = async (e) => {
    try {
      const res = await usuarioBaseService.buscarPorParametro(e.target.value, "Professor");
      setOpcoesProfessores(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCursos();
    if (state?.curso_id) {
      const curso = cursos.find((curso) => curso.id === Number(state.curso_id));
      if (curso) {
        setDisciplinas(curso.disciplinas);
        setTurmas(curso.turmas);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Turmas atualizadas:', turmas);
  }, [turmas]);
  
  useEffect(() => {
    console.log('Disciplinas atualizadas:', disciplinas);
  }, [disciplinas]);

  
  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={isEditing ? "Editar PPT" : "Cadastrar PPT"} ref={formRef}>
        {Object.keys(errors).length !== 0 && <p style={{ color: "red" }}>*Preencha os campos obrigatórios</p>}
        <label className="labelCadastroPPT">
          Aluno *
          <Input
            type='text'
            name='aluno'
            valor={formData.aluno_id}
            onChange={(e) => {
              fetchAlunos(e)

              if (opcoesAlunos) {
                const param = e.target.value
                console.log(e.target.value)

                const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || param === aluno?.matricula || param === aluno.email)

                if (aluno) setFormData({ ...formData, aluno_id: aluno.id })
              }
            }}
            erro={errors.aluno}
            textoAjuda='Insira nome ou matrícula do aluno'
            lista={'opcoesAlunos'}
          />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesAlunos">
          {
            opcoesAlunos ? (opcoesAlunos.map((aluno) => (
              <option className="optionCadastroPPT"
                value={aluno.nome || aluno?.matricula || aluno.email}>
                {aluno.nome || aluno?.matricula || aluno.email}
              </option>
            ))) : (<option>Nenhum aluno encontrado</option>)
          }
        </datalist>
        <label className="labelCadastroPPT">
          Docente Responsável pela Progressão *
          <Input
            tipo='text'
            nome='professor'
            valor={formData.professor_ppt_id}
            onChange={(e) => {
              fetchProfessores(e)

              if (opcoesProfessores) {
                const param = e.target.value
                console.log(e.target.value)

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({ ...formData, professor_ppt_id: professor.id })
              }
            }}
            erro={errors.professor_ppt}
            textoAjuda='Insira o email ou nome do professor'
            lista={'opcoesProfessores'}
          />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesProfessores">
          {
            opcoesProfessores ? (opcoesProfessores.map((professor) => (
              <option className="optionCadastroPPT"
                value={professor.nome || professor.email}>
                {professor.nome || professor.email}
              </option>
            ))) : (<></>)
          }
        </datalist>
        <label className="labelCadastroPPT">
          Docente que ministrou a disciplina *
          <Input
            tipo='text'
            nome='professor'
            valor={formData.professor_disciplina_id}
            onChange={(e) => {
              fetchProfessores(e)

              if (opcoesProfessores) {
                const param = e.target.value
                console.log(e.target.value)

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({ ...formData, professor_disciplina_id: professor.id })
              }
            }}
            erro={errors.professor_disciplina}
            textoAjuda='Insira o email ou nome do professor'
            lista={'opcoesProfessores'}
          />
        </label>
        <datalist className="datalistCadastroPPT" id="opcoesProfessores">
          {
            opcoesProfessores ? (opcoesProfessores.map((professor) => (
              <option className="optionCadastroPPT"
                value={professor.nome || professor.email}>
                {professor.nome || professor.email}
              </option>
            ))) : (<></>)
          }
        </datalist>
        <section className="sectionCadastroPPT">
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Curso *
              <select
                className={errors.curso ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                name="curso"
                value={formData.curso_id}
                onChange={(e) => {
                  const cursoId = e.target.value;
                  setFormData({ ...formData, curso_id: Number(cursoId) });

                  const curso = cursos.find(curso => curso.id === Number(cursoId));

                  if (curso) {
                    setDisciplinas(curso.disciplinas); // Atualiza as disciplinas
                    setTurmas(curso.turmas); // Atualiza as turmas
                  }
                }}
              >
                <option className="optionCadastroPPT" valor={formData.curso_id}>Selecione um curso</option>
                {cursos.map((curso, index) => (
                  <option className="optionCadastroPPT" key={index} valor={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="labelCadastroPPT">
              Disciplina *
              <select
                className={errors.disciplina ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.disciplina_id}
                onChange={(e) => setFormData({ ...formData, disciplina_id: Number(e.target.value) })}
              >
                <option className="optionCadastroPPT" value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option className="optionCadastroPPT" key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Turma de Origem *
              <select className={errors.turmaOrigem ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.turma_origem_id}
                onChange={(e) => setFormData({ ...formData, turma_origem_id: Number(e.target.value) })}
              >
                <option className="optionCadastroPPT" value="">Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
              {errors.turmas ? <p style={{ color: 'red', fontSize: '10px' }}>{errors.turmas}</p> : (<></>)}
            </label>
            <label className="labelCadastroPPT">
              Turma de Progressão *
              <select className={errors.turmaProgressao ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.turma_progressao}
                onChange={(e) => setFormData({ ...formData, turma_progressao_id: Number(e.target.value) })}
              >
                <option className="optionCadastroPPT" value="">Selecione uma turma</option>
                {
                  turmas.map((turma) => (
                    <option className="optionCadastroPPT" value={turma.id}>{turma.numero}</option>
                  ))
                }
              </select>
              {errors.turmas ? <p style={{ color: 'red', fontSize: '10px' }}>{errors.turmas}</p> : (<></>)}
            </label>
          </div>
        </section>
        <label className="labelCadastroPPT">
          Observações (opcional)
          <textarea
            className="textAreaCadastroPPT"
            onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
            name="observacoes"
            valor={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button text={isEditing ? "Salvar Alterações" : "Cadastrar"} tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
