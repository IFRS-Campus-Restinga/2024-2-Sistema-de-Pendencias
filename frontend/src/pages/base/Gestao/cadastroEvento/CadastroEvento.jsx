import React, { useState, useEffect } from 'react';
import { useredirect, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoCalendarioService } from '../../../../services/eventoCalendarioService';
import styles from './CadastroEvento.module.css';
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Input from '../../../../components/Input/Input';
import MensagemErro from '../../../../components/MensagemErro/MensagemErro';
import Label from '../../../../components/Label/Label';
import { validarComparacaoDatas, validarComparacaoHorario, validarData, validarHorario, validarNome } from '../../../../utils/validacoes';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';
import Loading from '../../../../components/Loading/Loading';

const CadastroEvento = () => {
  const location = useLocation()
  const redirect = useNavigate();
  const { state } = location
  const [erros, setErros] = useState({});
  const [calendario, setCalendario] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    hora_inicio: '',
    hora_fim: '',
    dia_todo: false,
    calendario: state.calendario
  });

  const fetchEvento = async () => {
    try {
      const res = await calendarioAcademicoService.eventoPorId(state.evento, 'detalhes')

      if (res.status !== 200) throw Error(res.message)

      setFormData({ ...res.data.evento, calendario: state.calendario })
      setCalendario(res.data.calendario)
    } catch (error) {
      console.error(error.message)
    } finally {
      setCarregando(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validarForm()) {
      let req

      if (state.evento) {
        req = calendarioAcademicoService.editarEvento(formData, state.evento)
      } else {
        req = calendarioAcademicoService.criarEvento(formData)
      }

      toast.promise(
        (async () => {
          const res = await req;

          if (res.status !== 201 && res.status !== 200) {
            throw new Error(JSON.stringify(["Erro ao registrar evento"]));
          }

          setErros({});

          setTimeout(() => {
            redirect(`/Gestão Escolar/calendarios/${state.calendario}/`, { state: state.calendario });
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

                  return 'Erro ao registrar evento.';
                } catch (e) {
                  return 'Erro inesperado ao processar mensagens.';
                }
              }

              return 'Erro ao registrar evento.';
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
    let novosErros = {
      titulo: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      hora_inicio: '',
      hora_fim: '',
    }

    for (let campo in formData) {
      switch (campo) {
        case 'titulo':
          novosErros.titulo = validarNome(formData.titulo)
          break;
        case 'descricao':
          novosErros.descricao = validarNome(formData.descricao)
          break;
        case 'data_inicio':
          novosErros.data_inicio = validarData(formData.data_inicio)
          break;
        case 'data_fim':
          novosErros.data_fim = validarComparacaoDatas(formData.data_inicio, formData.data_fim, true)
          break;
        case 'hora_inicio':
          if (!formData.dia_todo) novosErros.hora_inicio = validarHorario(formData.hora_inicio)
          break;
        case 'hora_fim':
          if (!formData.dia_todo) novosErros.hora_fim = validarComparacaoHorario(formData.hora_inicio, formData.hora_fim)
          break;

        default:
          break;
      }
    }

    setErros(novosErros)
    return !Object.values(novosErros).some((erro) => erro !== '')
  }

  useEffect(() => {
    if (state.evento) {
      fetchEvento()
    } else {
      setFormData({ ...formData, data_inicio: state.dataSelecionada, data_fim: state.dataSelecionada })
      setCarregando(false)
    }
  }, [state]);

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <div className='perfilContainer'>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro de Evento" textoInfo={'Caso o evento tenha mais de um dia de duração, podem ser fornecidos dias diferentes para datas de início e fim\n\nCaso não seja necessário fornecer um horário para o evento, marque a caixa "Evento dura o dia todo"'}>
        {Object.values(erros).some((erro) => erro !== '') ? <MensagemErro mensagem={'*Preencha todos os campos obrigatórios'} /> : null}

        {
          carregando ? (
            <Loading border={'green'} />
          ) : (
            <>
              <div className={styles.formGroup}>
                <Label titulo={'Título'}>
                  <Input
                    tipo={'text'}
                    valor={formData.titulo}
                    max={100}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    onBlur={() => setErros({ ...erros, titulo: validarNome(formData.titulo) })}
                    erro={erros.titulo}
                  />
                  {erros.titulo !== '' ? <MensagemErro mensagem={erros.titulo} /> : null}
                </Label>
              </div>
              <div className={styles.formGroup}>
                <Label titulo={'Data Início'}>
                  <Input
                    tipo={'date'}
                    valor={formData.data_inicio}
                    dataMinima={new Date().toISOString().split('T')[0]}
                    max={new Date(calendario.data_fim).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    onBlur={() => setErros({ ...erros, data_inicio: validarData(formData.data_inicio) })}
                    erro={erros.data_inicio}
                  />
                  {erros.data_inicio !== '' ? <MensagemErro mensagem={erros.data_inicio} /> : null}
                </Label>
                <Label titulo={'Data Fim'}>
                  <Input
                    tipo={'date'}
                    valor={formData.data_fim}
                    dataMinima={new Date().toISOString().split('T')[0]}
                    max={new Date(calendario.data_fim).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                    onBlur={() => setErros({ ...erros, data_fim: validarData(formData.data_fim) })}
                    erro={erros.data_fim}
                  />
                  {erros.data_fim !== '' ? <MensagemErro mensagem={erros.data_fim} /> : null}
                </Label>
              </div>
              {
                !formData.dia_todo ? (
                  <div className={styles.formGroup}>
                    <Label titulo={'Hora Início'}>
                      <Input
                        tipo={'time'}
                        valor={formData.hora_inicio}
                        onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                        onBlur={() => setErros({ ...erros, hora_inicio: validarHorario(formData.hora_inicio) })}
                        erro={erros.hora_inicio}
                      />
                      {erros.hora_inicio !== '' ? <MensagemErro mensagem={erros.hora_inicio} /> : null}
                    </Label>
                    <Label titulo={'Hora Fim'}>
                      <Input
                        tipo={'time'}
                        valor={formData.hora_fim}
                        onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                        onBlur={() => setErros({ ...erros, hora_fim: validarHorario(formData.hora_fim) })}
                        erro={erros.hora_fim}
                      />
                      {erros.hora_fim !== '' ? <MensagemErro mensagem={erros.hora_fim} /> : null}
                    </Label>
                  </div>
                ) : null
              }
              <div className={styles.formGroup}>
                <Label titulo={'Descrição'}>
                  <textarea
                    className={erros.descricao ? styles.textAreaErro : styles.textArea}
                    value={formData.descricao}
                    max={300}
                    minLength={10}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    onBlur={() => setErros({ ...erros, descricao: validarNome(formData.descricao) })}
                  />
                  {erros.descricao !== '' ? <MensagemErro mensagem={erros.descricao} /> : null}
                </Label>
              </div>
              <div className={styles.labelContainer}>
                <input id='dia_todo' type="checkbox" checked={formData.dia_todo} className={styles.checkbox} />
                <label className={styles.label} htmlFor='dia_todo' onClick={() => setFormData({ ...formData, dia_todo: !formData.dia_todo, hora_fim: null, hora_inicio: null })} />
                Evento dura o dia todo
              </div>
              <Button tipo='submit' texto='Salvar Evento' />
            </>
          )
        }

      </FormContainer>
    </div>
  );
};

export default CadastroEvento;