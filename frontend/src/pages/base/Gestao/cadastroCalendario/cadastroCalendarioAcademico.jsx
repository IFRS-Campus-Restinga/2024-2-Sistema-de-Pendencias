import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Label from '../../../../components/Label/Label';
import styles from './cadastroCalendarioAcademico.module.css';
import Input from '../../../../components/Input/Input';
import { validarComparacaoDatas, validarData, validarNome } from '../../../../utils/validacoes';
import MensagemErro from '../../../../components/MensagemErro/MensagemErro';
import Switch from '../../../../components/Switch/Switch';
import { calendarioAcademicoService } from '../../../../services/calendarioAcademicoService';

const CadastroCalendario = () => {
  const redirect = useNavigate()
  const location = useLocation()
  const { state } = location;
  const [erros, setErros] = useState({});
  const [formData, setFormData] = useState({
    titulo: '',
    data_inicio: '',
    data_fim: '',
    tipo_calendario: 'Integrado',
  });

  const trocaModalidade = (novoValor) => {
    setFormData({
      ...formData,
      tipo_calendario: novoValor,
    });
  };

  const validarForm = () => {
    let novosErros = {
      titulo: '',
      data_inicio: '',
      data_fim: '',
    }

    for (let campo in formData) {
      switch (campo) {
        case 'titulo':
          novosErros.titulo = validarNome(formData.titulo)
          break;
        case 'data_inicio':
          novosErros.data_inicio = validarData(formData.data_inicio)
          break;
        case 'data_fim':
          novosErros.data_fim = validarComparacaoDatas(formData.data_inicio, formData.data_fim, false)
          break;
        default:
          break;
      }
    }

    setErros(novosErros)
    return Object.values(novosErros).every((erro) => erro === '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validarForm()) {
      let req
      if (state) {
        req = calendarioAcademicoService.editar(state, formData)
      } else {
        req = calendarioAcademicoService.criar(formData)
      }

      toast.promise(
        (async () => {
          const res = await req;

          if (res.status !== 201 && res.status !== 200) {
            throw new Error(JSON.stringify(["Erro ao registrar calendário"]));
          }

          setErros({});

          // Redirecionar após um tempo
          setTimeout(() => {
            redirect('/Gestão Escolar/calendarios/');
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

                  return 'Erro ao registrar calendário.';
                } catch (e) {
                  return 'Erro inesperado ao processar mensagens.';
                }
              }

              return 'Erro ao registrar calendário.';
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

  return (
    <div className="perfilContainer">
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo={state ? "Editar Calendário" : "Cadastro de Calendário"} textoInfo={'Selecione a modalidade do calendário clicando no interruptor'}>
        <br />
        {Object.values(erros).some((erro) => erro !== '') ? <MensagemErro mensagem={'*Preencha os campos obrigatórios'} /> : null}
        <div className={styles.switchContainer}>
          <Switch valor={formData.tipo_calendario} valor1='ProEJA' valor2='Integrado' stateHandler={trocaModalidade} />
        </div>
        <Label titulo={"Título"}>
          <Input
            tipo={'text'}
            max={100}
            valor={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            onBlur={() => setErros({ ...erros, titulo: validarNome(formData.titulo) })}
            erro={erros.titulo}
          />
          {erros.titulo !== '' ? <MensagemErro mensagem={erros.titulo} /> : null}
        </Label>
        <div className={styles.formGroup}>
          <Label titulo={"Data Início"}>
            <Input
              tipo={'date'}
              valor={formData.data_inicio}
              onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              onBlur={() => setErros({ ...erros, data_inicio: validarData(formData.data_inicio) })}
              erro={erros.data_inicio}
            />
            {erros.data_inicio !== '' ? <MensagemErro mensagem={erros.data_inicio} /> : null}
          </Label>
          <Label titulo={"Data Final"}>
            <Input
              tipo={'date'}
              valor={formData.data_fim}
              onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
              onBlur={() => setErros({ ...erros, data_fim: validarData(formData.data_fim) })}
              erro={erros.data_fim}
            />
            {erros.data_fim !== '' ? <MensagemErro mensagem={erros.data_fim} /> : null}
          </Label>
        </div>
        <Button tipo="submit" texto={state ? "Salvar Alterações" : "Cadastrar Calendário"} />
      </FormContainer>
    </div>
  );
};

export default CadastroCalendario;
