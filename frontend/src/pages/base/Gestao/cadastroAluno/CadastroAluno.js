import "./CadastroAluno.css";
import Button from "../../../../components/Button/Button";
import axios from 'axios';
import React, { useState } from 'react';
import { validarFormulario, validarCampo } from './validacoes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alunoService } from "../../../../services/alunoService";

const CadastroAluno = () => {
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
        console.log(response.data);

        // Limpar o formulário após o sucesso
        setFormData({
          email: '',
          perfil: 'Aluno',
        });
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
      <form onSubmit={handleSubmit}>
        <h3>Cadastro Aluno</h3>
        <hr />
        <br />
        {showErrorMessage && <p style={{ color: 'red' }}>* Preencha os campos obrigatórios</p>}
        <br />
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => handleBlur('email')}
            placeholder="Email"
            style={{ borderColor: errors.email ? 'red' : '' }}
          />
          {errors.email && <p className="erros">{errors.email}</p>}
        </div>
        <div className="ajuste-button">
          <Button
            width="30%"
            color="#28A745"
            text="Cadastrar"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </>
  );
};

export default CadastroAluno;