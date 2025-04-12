import styles from "./CadastroCurso.module.css";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { cursoService } from "../../../../services/cursoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input';
import Switch from "../../../../components/Switch/Switch";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioService } from "../../../../services/usuarioService";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";
import Label from "../../../../components/Label/Label";
import { validarCargaHoraria, validarNome, validarTurma } from "../../../../utils/validacoes";
import OpcoesBusca from "../../../../components/OpcoesBusca.jsx/OpcoesBusca";

const CadastroCurso = () => {
  const redirect = useNavigate()
  const location = useLocation();
  const { state } = location || {};
  const [modalidade, setModalidade] = useState('Integrado');
  const [opcoesCoordenadores, setOpcoesCoordenadores] = useState([]);
  const [coordenador, setCoordenador] = useState()
  const [erros, setErros] = useState({
    nome: '',
    carga_horaria: '',
    coordenador: '',
    modalidade: '',
    turmas: []
  });
  const [formData, setFormData] = useState({
    nome: '',
    carga_horaria: '',
    modalidade: modalidade,
    coordenador: '',
    turmas: []
  });

  const trocaModalidade = (novoValor) => {
    setModalidade(novoValor);
    setFormData({
      ...formData,
      modalidade: novoValor,
      turmas: []
    });
  };

  const fetchCoordenadores = async (e) => {
    try {
      const res = await UsuarioService.buscarPorParametro(e.target.value, 'Coordenador');

      setOpcoesCoordenadores(res.data);  // Garantir que seja um array vazio em caso de erro ou resposta vazia
    } catch (error) {
      console.error(error)
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();

    if (validarForm()) {
      let req
      if (state) {
        req = cursoService.editar(state, formData);
      } else {
        req = cursoService.criar(formData)
      }

      toast.promise(
        (async () => {
          const res = await req;

          if (res.status !== 200) {
            throw new Error(JSON.stringify(["Erro ao registrar curso"]));
          }

          setErros({
            nome: '',
            carga_horaria: '',
            coordenador: '',
            modalidade: '',
            turmas: []
          });

          // Redirecionar após um tempo
          setTimeout(() => {
            redirect('/Gestão Escolar/cursos/');
          }, 3000);

          return res;
        })(),
        {
          pending: 'Realizando registro...',
          success: 'Registro realizado com sucesso!',
          error: {
            render({ data }) {
              if (data instanceof Error) {
                try {
                  const mensagens = JSON.parse(data.message);

                  if (Array.isArray(mensagens)) {
                    mensagens.forEach((mensagem, index) => {
                      if (index > 0) {
                        toast.error(mensagem, {
                          autoClose: 3000,
                          position: 'bottom-center',
                          style: { textAlign: 'center', whiteSpace: 'pre-line' },
                        });
                      }
                    });

                    return mensagens[0];
                  }

                  return 'Erro ao registrar curso.';
                } catch (e) {
                  return 'Erro inesperado ao processar mensagens.';
                }
              }

              return 'Erro ao registrar curso.';
            }
          }
        },
        {
          autoClose: 3000,
          position: 'bottom-center',
          style: { textAlign: 'center', whiteSpace: 'pre-line' }
        }
      );
    }
  };

  const validarForm = () => {
    let validado = true;
    let novosErros = {
      nome: '',
      carga_horaria: '',
      coordenador: '',
      modalidade: '',
      turmas: []
    };

    for (let campo in formData) {
      switch (campo) {
        case 'nome':
          const erroNome = validarNome(formData.nome);
          if (erroNome !== '') {
            novosErros.nome = erroNome;
            validado = false;
          }
          break;

        case 'carga_horaria':
          const erroCarga = validarCargaHoraria(formData.carga_horaria);
          if (erroCarga !== '') {
            novosErros.carga_horaria = erroCarga;
            validado = false;
          }
          break;

        case 'coordenador':
          const erroCoord = validarNome(coordenador);
          if (erroCoord !== '') {
            novosErros.coordenador = erroCoord;
            validado = false;
          }
          break;

        case 'modalidade':
          if (modalidade === 'Integrado' && formData.turmas.length === 0) {
            novosErros.modalidade = 'Cursos da modalidade Integrado devem conter turmas';
            validado = false;
          }
          break;

        case 'turmas':
          const errosTurmas = formData.turmas.map((turma) => validarTurma(turma.numero));
          if (errosTurmas.some((e) => e !== '')) {
            novosErros.turmas = errosTurmas;
            validado = false;
          }
          break;

        default:
          break;
      }
    }

    setErros(novosErros);
    return validado;
  };

  const addTurma = () => {
    setFormData((prevData) => ({
      ...prevData,
      turmas: [...prevData.turmas, { numero: '' }],  // Adiciona uma turma vazia
    }));
  };

  const handleTurmaChange = (index, value) => {
    const updatedTurmas = formData.turmas.map((turma, i) =>
      i === index ? { ...turma, numero: value } : turma
    );
    setFormData((prevData) => ({ ...prevData, turmas: updatedTurmas }));
  };

  const removeTurma = (index) => {
    const updatedTurmas = formData.turmas.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, turmas: updatedTurmas }));
  };

  const fetchCurso = async () => {
    try {
      const res = await cursoService.porId(state)

      if (res.status !== 200) throw new Error(res)

      setCoordenador(res.data.coordenador.email)
      setModalidade(res.data.modalidade)
      setFormData({
        carga_horaria: res.data.carga_horaria,
        coordenador: res.data.coordenador.id,
        modalidade: res.data.modalidade,
        nome: res.data.nome,
        turmas: res.data.turmas
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (state) fetchCurso()
  }, [state])

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleEnviar} titulo={state ? 'Editar Curso' : 'Cadastrar Curso'} comprimento='70%'>
        {Object.values(erros).some(
          (erro) => (typeof erro === 'string' && erro !== '') ||
            (Array.isArray(erro) && erro.some(e => e !== ''))
        ) && (
            <MensagemErro mensagem="* Preencha os campos obrigatórios" />
          )}        <div className={styles.switchContainer}>
          <Label titulo={'Modalidade'} />
          <Switch valor={modalidade} valor1='ProEJA' valor2='Integrado' stateHandler={trocaModalidade} />
        </div>

        <div className={styles.formGroup}>
          <Label titulo={'Nome'}>
            <Input
              tipo="text"
              valor={formData.nome}
              max={30}
              erro={erros.nome}
              onChange={(e) => {
                if (isNaN(Number(e.target.value)) || e.target.value === '') setFormData({ ...formData, nome: e.target.value })
              }}
              onBlur={() => setErros({ ...erros, nome: validarNome(formData.nome) })}
              textoAjuda='Nome do curso'
            />
          </Label>
          {erros.nome !== '' ? <MensagemErro mensagem={erros.nome} /> : null}
        </div>

        <div className={styles.formGroup}>
          <Label titulo={'Carga Horária'}>
            <Input
              tipo='text'
              max={5}
              valor={formData.carga_horaria}
              erro={erros.carga_horaria}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) setFormData({ ...formData, carga_horaria: e.target.value })
              }}
              onBlur={() => setErros({ ...erros, carga_horaria: validarCargaHoraria(formData.carga_horaria) })}
            />
          </Label>
          {erros.carga_horaria !== '' ? <MensagemErro mensagem={erros.carga_horaria} /> : null}
        </div>

        <div className={styles.formGroupDatalist}>
          <Label titulo={'Coordenador'}>
            <Input
              tipo='text'
              nome='coordenador'
              valor={coordenador}
              onChange={(e) => {
                fetchCoordenadores(e)
                setCoordenador(e.target.value)
              }}
              onBlur={() => setErros({ ...erros, coordenador: validarNome(coordenador) })}
              erro={erros.coordenador}
              textoAjuda='Insira email do coordenador'
            />
            {
              opcoesCoordenadores?.length > 0 ? (
                <OpcoesBusca
                  opcoes={opcoesCoordenadores}
                  setValor={(opcao) => {
                    setFormData({ ...formData, coordenador: opcao.id })
                    setCoordenador(opcao.email)
                    setOpcoesCoordenadores([])
                  }}
                  chave={'email'}
                  mensagemErro={'Nenhum coordenador encontrado'}
                />
              ) : null
            }
            {erros.coordenador !== '' ? <MensagemErro mensagem={erros.coordenador} /> : null}
          </Label>
        </div>

        <div className="add-turma">
          {
            modalidade === 'Integrado' ? (
              <>
                <button type="button" onClick={addTurma} className={styles.botaoAdd}>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    style={{ color: "#006b3f", cursor: "pointer", fontSize: "24px" }}
                  />
                  <Label titulo={'Adicionar turmas'} />
                </button>
                {
                  erros.modalidade !== '' ? <MensagemErro mensagem={erros.modalidade} /> : null
                }
              </>
            ) : null
          }
          {
            formData.turmas.length > 0 ? (
              <div className={styles.listaTurmas}>
                <table className={styles.tabelaTurmas}>
                  <thead className={styles.cabecalhoTabelaTurmas}>
                    <tr>
                      <th>Número da Turma</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.turmas.map((turma, index) => (
                      <tr key={index}>
                        <td>
                          <Input
                            tipo='text'
                            valor={turma.numero}
                            erro={erros.turmas[index]}
                            max={3}
                            onChange={(e) => {
                              if (!isNaN(Number(e.target.value))) handleTurmaChange(index, e.target.value)
                            }}
                            onBlur={() => {
                              setErros((prevState) => ({
                                ...prevState,
                                turmas: {
                                  ...prevState.turmas,
                                  [index]: validarTurma(formData.turmas[index].numero)
                                }
                              }))
                            }}
                            textoAjuda='A turma pode incluir apenas números'
                          />
                          {erros.turmas ? erros.turmas[index] !== '' ? <MensagemErro mensagem={erros.turmas[index]} /> : null : null}
                        </td>
                        <td onClick={() => removeTurma(index)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                              color: "rgb(205, 68, 59)",
                              fontSize: "15px",
                              cursor: "pointer"
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null
          }
        </div>
        <Button tipo='submit' texto={state ? 'Salvar Alterações' : 'Cadastrar Curso'} />
      </FormContainer>
    </>
  );
};

export default CadastroCurso;
