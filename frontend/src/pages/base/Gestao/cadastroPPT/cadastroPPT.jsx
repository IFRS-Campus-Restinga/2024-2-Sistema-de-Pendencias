import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode'
import styles from "./cadastroPPT.module.css";
import { PPTService } from "../../../../services/pptService";
import { cursoService } from "../../../../services/cursoService";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import loading from '../../../../assets/loading-disciplinas.png'
import { UsuarioService } from "../../../../services/usuarioService";

const CadastroPPT = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true)
  const [desabilitado, setDesabilitado] = useState(false)
  const { state } = location || {};
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [opcoesAlunos, setOpcoesAlunos] = useState([]);
  const [opcoesProfessores, setOpcoesProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    aluno: '',
    professor_disciplina: '',
    professor_ppt: '',
    curso: '',
    disciplina: '',
    turma_atual: '',
    turma_progressao: '',
    observacao: '',
  });

  const [controleInputs, setControleInputs] = useState({
    aluno: '',
    professor_disciplina: '',
    professor_ppt: '',
    curso: '',
    disciplina: '',
    turma_atual: '',
    turma_progressao: '',
    observacao: ''
  })

  const fetchPPT = async () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();


  };

  const fetchCursos = async () => {
    try {
      const res = await cursoService.porModalidade("Integrado", 'dependencia');

      setCursos(res.data);

      setIsLoading(false)

    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlunos = async (e) => {
    try {
      const res = await UsuarioService.buscarPorParametro(e.target.value, "Aluno");
      setOpcoesAlunos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfessores = async (e) => {
    try {
      const res = await UsuarioService.buscarPorParametro(e.target.value, "Professor");
      setOpcoesProfessores(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state) {
      fetchPPT()
      setDesabilitado(true)
    } else {
      fetchCursos()
    }
  }, [state]);

  if (isLoading) return <LoadingIFRS icone={loading} />

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={state ? "Editar PPT" : "Cadastrar PPT"} ref={formRef}>
        {Object.keys(errors).length !== 0 && <p style={{ color: "red" }}>*Preencha os campos obrigatórios</p>}
        <label className="labelCadastroPPT">
          Aluno *
          <Input
            type='text'
            name='aluno'
            valor={controleInputs.aluno}
            desabilitado={desabilitado}
            onChange={(e) => {
              setControleInputs({ ...controleInputs, aluno: e.target.value })
              fetchAlunos(e)

              console.log(e.target.value)

              if (opcoesAlunos) {
                const param = e.target.value

                const aluno = opcoesAlunos.find((aluno) => param === aluno.nome || param === aluno?.matricula || param === aluno.email)

                if (aluno) setFormData({ ...formData, aluno: aluno.id })
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
            valor={controleInputs.professor_ppt}
            onChange={(e) => {
              setControleInputs({ ...controleInputs, professor_ppt: e.target.value })
              fetchProfessores(e)

              if (opcoesProfessores) {
                const param = e.target.value

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({ ...formData, professor_ppt: professor.id })
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
            valor={controleInputs.professor_disciplina}
            desabilitado={desabilitado}
            onChange={(e) => {
              setControleInputs({ ...controleInputs, professor_disciplina: e.target.value })
              fetchProfessores(e)

              if (opcoesProfessores) {
                const param = e.target.value

                const professor = opcoesProfessores.find((professor) => param === professor.nome || param === professor.email)

                if (professor) setFormData({ ...formData, professor_disciplina: professor.id })
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
                value={formData.curso}
                disabled={desabilitado}
                onChange={(e) => {
                  const cursoId = e.target.value;

                  const curso = cursos.find(curso => curso.id === Number(cursoId));

                  if (curso) {
                    setFormData({ ...formData, curso: Number(cursoId) });
                    setDisciplinas(curso.disciplinas); // Atualiza as disciplinas
                    setTurmas(curso.turmas); // Atualiza as turmas
                  }
                }}
              >
                {
                  !state ? (
                    <option className="optionCadastroPED" value=''>{'Selecione um curso'}</option>
                  ) : (<></>)
                }
                {
                  cursos.map((curso, index) => (
                    <option className="optionCadastroPED" value={curso.id} key={index}>{curso.nome}</option>
                  ))
                }
              </select>
            </label>
            <label className="labelCadastroPPT">
              Disciplina *
              <select
                className={errors.disciplina ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.disciplina}
                disabled={desabilitado}
                onChange={(e) => setFormData({ ...formData, disciplina: Number(e.target.value) })}
              >
                {
                  !state ? (
                    <option className="optionCadastroPED" value=''>{'Selecione uma disciplina'}</option>
                  ) : (<></>)
                }
                {
                  disciplinas.map((disciplina, index) => (
                    <option className="optionCadastroPED" value={disciplina.id} key={index}>{disciplina.nome}</option>
                  ))
                }
              </select>
            </label>
          </div>
          <div className="divCadastroPPT">
            <label className="labelCadastroPPT">
              Turma Atual *
              <select className={errors.turma_atual ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.turma_atual}
                disabled={desabilitado}
                onChange={(e) => setFormData({ ...formData, turma_atual: Number(e.target.value) })}
              >
                {
                  !state ? (
                    <option className="optionCadastroPED" value=''>{'Selecione uma turma'}</option>
                  ) : (<></>)
                }
                {
                  turmas.map((turma, index) => (
                    <option className="optionCadastroPED" value={turma.id} key={index}>{turma.numero}</option>
                  ))
                }
              </select>
              {errors.turmas ? <p style={{ color: 'red', fontSize: '10px' }}>{errors.turmas}</p> : (<></>)}
            </label>
            <label className="labelCadastroPPT">
              Turma de Progressão *
              <select className={errors.turma_progressao ? 'errorSelectCadastroPPT' : 'selectCadastroPPT'}
                value={formData.turma_progressao}
                onChange={(e) => setFormData({ ...formData, turma_progressao: Number(e.target.value) })}
              >
                {
                  !state ? (
                    <option className="optionCadastroPED" value=''>{'Selecione uma turma de progressão'}</option>
                  ) : (<></>)
                }
                {
                  turmas.map((turma, index) => (
                    <option className="optionCadastroPED" value={turma.id} key={index}>{turma.numero}</option>
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
            value={formData.observacao}
            placeholder="Caso haja alguma observação sobre o aluno, insira aqui"
          />
        </label>
        <Button text={state ? "Salvar Alterações" : "Cadastrar"} tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
