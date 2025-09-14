import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode'
import styles from "./PPTForm.module.css";
import { PPTService } from "../../../../services/pptService";
import { cursoService } from "../../../../services/cursoService";
import LoadingIFRS from "../../../../components/LoadingIFRS/LoadingIFRS";
import loading from '../../../../assets/loading-disciplinas.png'
import { UsuarioService } from "../../../../services/usuarioService";
import modalidadeMap from "../../../../utils/modalidadeMap";
import Label from "../../../../components/Label/Label";
import OpcoesBusca from "../../../../components/OpcoesBusca.jsx/OpcoesBusca";
import { AxiosError } from "axios";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import { validarCampoUUID4 } from "../../../../utils/validacoes";
import Select from "../../../../components/Select/Select";

const CadastroPPT = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true)
  const [desabilitado, setDesabilitado] = useState(false)
  const { state } = location || {};
  const [opcoesCurso, setOpcoesCurso] = useState([]);
  const [opcoesDisciplina, setOpcoesDisciplina] = useState([]);
  const [opcoesAluno, setOpcoesAluno] = useState([]);
  const [opcoesProfessorPPT, setOpcoesProfessorPPT] = useState([]);
  const [opcoesProfessorDisciplina, setOpcoesProfessorDisciplina] = useState([]);
  const [opcoesTurmaProgressao, setOpcoesTurmaProgressao] = useState([])
  const [opcoesTurmaAtual, setOpcoesTurmaAtual] = useState([])
  const [turmas, setTurmas] = useState([]);
  const [erros, setErros] = useState({});
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

  const fetchCursos = async (e) => {
    try {
      const res = await cursoService.buscarPorModalidade(undefined, e.target.value, modalidadeMap['Integrado'], 'id, name, course_class.id, course_class.number');

      setOpcoesCurso(res.data.results);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.log(error);
      }
    }
  };

  const fetchAlunos = async (e) => {
    try {
      const res = await UsuarioService.buscar(undefined, e.target.value, 'aluno', 'id, username');

      setOpcoesAluno(res.data.results);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.log(error);
      }
    }
  };

  const fetchProfessores = async (e, tipo) => {
    try {
      const res = await UsuarioService.buscarPorParametro(e.target.value, "professor", 'id, username');

      if (tipo === 'ppt') setOpcoesProfessorPPT(res.data.results);
      if (tipo === 'disciplina') setOpcoesProfessorDisciplina(res.data.results);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (state) {
      fetchPPT()
      setDesabilitado(true)
    } else {
      setIsLoading(false)
    }
  }, [state]);

  if (isLoading) return <CustomLoading/>

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={state ? "Editar PPT" : "Cadastrar PPT"} ref={formRef}>
        {Object.keys(erros).length !== 0 && <p style={{ color: "red" }}>*Preencha os campos obrigatórios</p>}
          <section className={styles.section}>
            <div className={styles.formGroup}>
              <Label titulo={'Aluno *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='aluno'
                    valor={controleInputs.aluno}
                    onChange={(e) => {
                      fetchAlunos(e)
                      setControleInputs({ ...controleInputs, aluno: e.target.value })
                    }}
                    erro={erros.aluno}
                    textoAjuda='Insira nome ou matrícula do aluno'
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesAluno?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesAluno}
                        setValor={(opcao) => {
                          setFormData({ ...formData, aluno: opcao.id })
                          setControleInputs({ ...controleInputs, aluno: opcao.username })
                          setOpcoesAluno([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
                {erros.aluno !== '' ? <MensagemErro mensagem={erros.aluno} /> : null}
              </Label>
              <Label titulo={'Docente responsável pela progressão *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='professor'
                    valor={controleInputs.professor_ppt}
                    onChange={(e) => {
                      fetchProfessores(e, 'ppt')
                      setControleInputs({ ...controleInputs, professor_ppt: e.target.value })
                    }}
                    erro={erros.professor_ppt}
                    textoAjuda='Insira o email ou nome do professor'
                  />
                  {
                    opcoesProfessorPPT?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesProfessorPPT}
                        setValor={(opcao) => {
                          setFormData({ ...formData, professor_ppt: opcao.id })
                          setControleInputs({ ...controleInputs, professor_ppt: opcao.username })
                          setOpcoesProfessorPPT([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
                {erros.professor_ped !== '' ? <MensagemErro mensagem={erros.professor_ped} /> : null}
              </Label>
              <Label titulo={'Docente que ministrou a disciplina *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo='text'
                    nome='professor'
                    valor={controleInputs.professor_disciplina}
                    onChange={(e) => {
                      fetchProfessores(e, 'disciplina')
                      setControleInputs({ ...controleInputs, professor_disciplina: e.target.value })
                    }}
                    erro={erros.professor_disciplina}
                    textoAjuda='Insira o email ou nome do professor'
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesProfessorDisciplina?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesProfessorDisciplina}
                        setValor={(opcao) => {
                          setFormData({ ...formData, professor_disciplina: opcao.id })
                          setControleInputs({ ...controleInputs, professor_disciplina: opcao.username })
                          setOpcoesProfessorDisciplina([])
                        }}
                        chave={'username'}
                      />
                    ) : null
                  }
                </div>
                {erros.professor_disciplina !== '' ? <MensagemErro mensagem={erros.professor_disciplina} /> : null}
              </Label>
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.formGroup}>
              <Label titulo={'Curso *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo={'text'}
                    valor={controleInputs.curso}
                    onChange={(e) => {
                      setControleInputs({ ...controleInputs, curso: e.target.value })
                      fetchCursos(e)
                    }}
                    erro={erros.curso}
                    textoAjuda={'Pesquise o Curso'}
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesCurso?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesCurso}
                        setValor={(opcao) => {
                          setFormData({ ...formData, curso: opcao.id })
                          setControleInputs({ ...controleInputs, curso: opcao.name })
                          setOpcoesTurmaAtual(opcao.course_class)
                          setOpcoesTurmaProgressao(opcao.course_class)
                          setOpcoesCurso([])
                        }}
                        chave={'name'}
                      />
                    ) : null
                  }
                </div>
                {erros.curso !== '' ? <MensagemErro mensagem={erros.curso} /> : null}
              </Label>
              <Label titulo={'Disciplina *'}>
                <div className={styles.inputContainer}>
                  <Input
                    tipo={'text'}
                    valor={controleInputs.disciplina}
                    onChange={(e) => {
                      setControleInputs({ ...controleInputs, disciplina: e.target.value })
                      fetchDisciplina(e)
                    }}
                    erro={erros.disciplina}
                    textoAjuda={'Pesquise a disciplina'}
                    desabilitado={desabilitado}
                  />
                  {
                    opcoesDisciplina?.length > 0 ? (
                      <OpcoesBusca
                        opcoes={opcoesDisciplina}
                        setValor={(opcao) => {
                          setFormData({ ...formData, disciplina: opcao.id })
                          setControleInputs({ ...controleInputs, disciplina: opcao.name })
                          setOpcoesDisciplina([])
                        }}
                        chave={'name'}
                      />
                    ) : null
                  }
                  {erros.disciplina !== '' ? <MensagemErro mensagem={erros.disciplina} /> : null}
                </div>
              </Label>
            </div>
            <div className={styles.formGroup}>
              <Label titulo={'Turma da Progressão *'}>
                <Select
                  opcoes={opcoesTurmaProgressao}
                  selecionado={controleInputs.turma_progressao}
                  setValor={(opcao) => {
                    setFormData({...formData, turma_progressao: opcao.id})
                    setControleInputs({...controleInputs, turma_progressao: opcao.number})
                  }}
                  desabilitado={state ? desabilitado : formData.curso > 0 ? false : true}
                  chave={'number'}
                />
                {erros.turma_serie !== '' ? <MensagemErro mensagem={erros.turma_serie} /> : null}
              </Label>
              <Label titulo={'Turma Atual *'}>
                <Select
                  opcoes={opcoesTurmaAtual}
                  selecionado={controleInputs.turma_atual}
                  setValor={(opcao) => {
                    setFormData({...formData, turma_atual: opcao.id})
                    setControleInputs({...controleInputs, turma_atual: opcao.number})
                  }}
                  desabilitado={state ? desabilitado : formData.curso > 0 ? false : true}
                  chave={'number'}
                />
                {erros.turma_serie !== '' ? <MensagemErro mensagem={erros.turma_serie} /> : null}
              </Label>
            </div>
          </section>
        <Button text={state ? "Salvar Alterações" : "Cadastrar"} tipo="submit" />
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
