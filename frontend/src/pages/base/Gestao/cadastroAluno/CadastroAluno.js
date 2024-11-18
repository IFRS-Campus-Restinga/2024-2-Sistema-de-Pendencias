import "./CadastroAluno.css";
import React, { useRef, useState } from 'react';
import { validarFormulario, validarCampo } from './validacoes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alunoService } from "../../../../services/alunoService";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input'

const CadastroAluno = () => {
  const formRef = useRef()
  const [formData, setFormData] = useState({
    email: '',
    perfil: 'Aluno',
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        const response = await alunoService.create(formData)

        if (response.status !== 201) throw new Error(response.error)
        // Limpar o formulário após o sucesso
        setFormData({
          email: '',
          perfil: 'Aluno',
        });

        formRef.current.reset()

        setErrors({}); // Limpar os erros também

        // Mostrar toast de sucesso
        toast.success("Registro realizado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff' },
          progressStyle: { backgroundColor: '#fff' }
        });
      } catch (error) {
        console.error('Erro ao cadastrar aluno!', error);

          // Toast de erro
          toast.error("Falha na operação. Tente novamente.", {
            position: "bottom-center",
            autoClose: 3000,
            style: { backgroundColor: '#d11c28', color: '#fff' },
            progressStyle: { backgroundColor: '#fff' }
          });
        }
    } else {
      setErrors(validationErrors);
      setShowErrorMessage(true);
    }
  };

  const handleBlur = (campo) => {
    const error = validarCampo(campo, formData[campo]);
    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [campo]: error }));
    } else {
      setErrors((prevErrors) => {
        const { [campo]: removed, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo='Cadastro Aluno' comprimento='60%' ref={formRef}>
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}
        <br />
        <div className="divCadastroAluno">
          <label htmlFor="email" className="labelCadastroAluno">Matrícula</label>
            <span className="spanCadastroAluno">
              <Input
                tipo='text'
                onChange={(e) => setFormData({ ...formData, email: `${e.target.value}@aluno.restinga.ifrs.edu.br`})}
                onBlur={() => handleBlur('email')}
                textoAjuda="Insira a matrícula do aluno"
                erro={errors.email}
              />
              <p className="pCadastroAluno">@aluno.restinga.ifrs.edu.br</p>
            </span>
          {errors.email && <p className="erros">{errors.email}</p>}
        </div>
        <div className="ajuste-button">
        </div>
        <Button tipo='submit' text='Cadastrar Aluno'/>        
      </FormContainer>
    </>
  );
};

export default CadastroAluno;