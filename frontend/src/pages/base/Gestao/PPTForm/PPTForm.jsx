import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import styles from "./PPTForm.module.css";
import { PPTService } from "../../../../services/pptService";
import { cursoService } from "../../../../services/cursoService";
import { UsuarioService } from "../../../../services/usuarioService";
import modalidadeMap from "../../../../utils/modalidadeMap";
import Label from "../../../../components/Label/Label";
import OpcoesBusca from "../../../../components/OpcoesBusca/OpcoesBusca";
import { AxiosError } from "axios";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import Select from "../../../../components/Select/Select";
import { disciplinaService } from "../../../../services/disciplinaService";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";
import { validarCampoUUID4 } from "../../../../utils/validacoes";

const CadastroPPT = () => {
  const formRef = useRef();
  const redirect = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const [opcoesCurso, setOpcoesCurso] = useState([]);
  const [opcoesDisciplina, setOpcoesDisciplina] = useState([]);
  const [opcoesAluno, setOpcoesAluno] = useState([]);
  const [opcoesProfessorPPT, setOpcoesProfessorPPT] = useState([]);
  const [opcoesProfessorDisciplina, setOpcoesProfessorDisciplina] = useState([]);
  const [opcoesTurmaProgressao, setOpcoesTurmaProgressao] = useState([])
  const [opcoesTurmaAtual, setOpcoesTurmaAtual] = useState([])
  const [turmas, setTurmas] = useState([]);
  const [erros, setErros] = useState({
    aluno: null,
    professor_disciplina: null,
    professor_ppt: null,
    curso: null,
    disciplina: null,
    turma_atual: null,
    turma_progressao: null,
    observacao: null,
  });
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

  const validarForm = () => {
    let novosErros = {
      aluno: null,
      professor_disciplina: null,
      professor_ppt: null,
      curso: null,
      disciplina: null,
      turma_atual: null,
      turma_progressao: null,
      observacao: null,
    }

    for (let campo in formData) {
        if (campo !== 'observacao') {
         novosErros[campo] = validarCampoUUID4(formData[campo]) 
        }
      }

    setErros(novosErros)
    return Object.values(novosErros).every((erro) => erro === null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validarForm()) {
          toast.promise(
            PPTService.criar(formData),
            {
              pending: 'Realizando registro...',
              success: {
                render({data}) {
                  return data.data.message
                }
              },
              error: "Erro de Validação"
            },
          ).then((res) => {
            if (res.status === 200 || res.status === 201) {
              setErros({})
              setTimeout(() => {
                redirect('/session/gestao_escolar/ppts')
              }, 3000);
            }
          }).catch((err) => {
              if (err instanceof AxiosError) {
                  const errors = err.response?.data?.message;

                  if (Array.isArray(errors)) {
                      errors.forEach((msg) => toast.error(msg));
                  } else {
                      toast.error(errors);
                  }
              }
          })
      }
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

  const fetchDisciplina = async (e) => {
      try {
        if (!formData.curso || formData.curso === '') {
          setErros({ ...erros, disciplina: 'É necessário selecionar um curso antes de buscar uma disciplina' })
        } else {
          setErros({ ...erros, disciplina: null })
  
          const res = await disciplinaService.buscarPorCurso(formData.curso, undefined, e.target.value, 'id, name, code')
  
          setOpcoesDisciplina(res.data.results)
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response.data.message)
        } else {
          console.error(error)
        }
      }
    }

  const fetchAlunos = async (e) => {
    try {
      const res = await UsuarioService.buscarHub(undefined, e.target.value, 'aluno', 'id, username');

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
      const res = await UsuarioService.listarGrupo("professor", undefined, e.target.value, 'id, username');

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

  return (
    <>
      <ToastContainer />
      <FormContainer titulo={"Cadastrar PPT"}>
        {Object.values(erros).some((erro) => erro !== null) ? <MensagemErro mensagem={"Preencha os campos obrigatórios (*)"}/> : null}
        <ToastContainer autoClose={2000} position="bottom-right" />
          <form onSubmit={handleSubmit} className={styles.form}>
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
                    </div>
                  </Label>
                </div>
                <div className={styles.selectFormGroup}>
                  <Label titulo={'Turma da Progressão *'}>
                    <Select
                      opcoes={opcoesTurmaProgressao}
                      selecionado={controleInputs.turma_progressao}
                      setValor={(opcao) => {
                        setFormData({...formData, turma_progressao: opcao.id})
                        setControleInputs({...controleInputs, turma_progressao: opcao.number})
                      }}
                      chave={'number'}
                    />
                  </Label>
                  <Label titulo={'Turma Atual *'}>
                    <Select
                      opcoes={opcoesTurmaAtual}
                      selecionado={controleInputs.turma_atual}
                      setValor={(opcao) => {
                        setFormData({...formData, turma_atual: opcao.id})
                        setControleInputs({...controleInputs, turma_atual: opcao.number})
                      }}
                      chave={'number'}
                    />
                  </Label>
                </div>
              </section>
              <Button texto={"Cadastrar"} tipo="submit" />
          </form>
      </FormContainer>
    </>
  );
};

export default CadastroPPT;
