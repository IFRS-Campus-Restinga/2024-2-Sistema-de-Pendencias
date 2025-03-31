import styles from "./CadastroAluno.module.css";
import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input'
import { UsuarioService } from "../../../../services/usuarioService";
import { validarMatricula } from "../../../../utils/validacoes";
import Label from "../../../../components/Label/Label";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";

const CadastroAluno = () => {
  const formRef = useRef()
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarForm();

    if (erros === '') {
      setErrors({ ...errors, email: '' });

      const cadastroPromise = UsuarioService.criar({
        grupo: 'Aluno',
        email: `${formData.email}@aluno.restinga.ifrs.edu.br`
      });

      toast.promise(
        cadastroPromise,
        {
          pending: "Realizando cadastro...",
          success: "Registro realizado com sucesso!",
          error: {
            render({ data }) {
              return data instanceof Error ? data.message : "Erro ao cadastrar usuário";
            }
          }
        },
        {
          position: "bottom-center",
          autoClose: 3000,
          style: { textAlign: 'center' }
        }
      );

      try {
        const res = await cadastroPromise;

        if (res.status !== 201) throw new Error(res.mensagem);

        setErrors({ email: '' });
        setFormData({ email: '' });
      } catch (error) {
        console.error(error.message);
      }
    } else {
      setErrors({ email: erros });
    }
  };

  const validarForm = () => {
    return validarMatricula(formData.email)
  }

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo='Cadastro Aluno' comprimento='60%' ref={formRef} textoInfo={'Insira no campo abaixo apenas a matrícula do aluno (somente números).\n\nCada aluno pode ser registrado apenas uma vez no sistema.'}>
        {errors.email !== '' ? <MensagemErro mensagem={'* Preencha os campos obrigatórios'} /> : null}
        <br />
        <div className={styles.div}>
          <Label titulo={'Matrícula'}>
            <span className={styles.span}>
              <Input
                tipo='text'
                id={'matrícula'}
                max={10}
                valor={formData.email}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) setFormData({ ...formData, email: e.target.value })
                }}
                onBlur={() => setErrors({ ...errors, email: validarMatricula(formData.email) })}
                textoAjuda="Insira a matrícula do aluno"
                erro={errors.email}
              />
              <p>@aluno.restinga.ifrs.edu.br</p>
            </span>
          </Label>
          {errors.email !== '' ? <MensagemErro mensagem={errors.email} /> : null}
          <Button tipo='submit' texto='Cadastrar Aluno' />
        </div>
      </FormContainer>
    </>
  );
};

export default CadastroAluno;