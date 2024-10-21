import Button from "../../../../components/Button/Button";
import axios from 'axios';
import React, { useState } from 'react';
import { validarFormulario, validarCampo } from './validacoes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroAluno = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: 'Aluno',
    matricula: ''
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length === 0) {
      setShowErrorMessage(false);
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-aluno/', formData);
        console.log(response.data);

        // Limpar o formulário após o sucesso
        setFormData({
          nome: '',
          email: '',
          perfil: 'Aluno',
          matricula: ''
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
          <label htmlFor="nome">Nome completo:</label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            onBlur={() => handleBlur('nome')}
            placeholder="Nome"
            style={{ borderColor: errors.nome ? 'red' : '' }}
          />
          {errors.nome && <p className="erros">{errors.nome}</p>}
        </div>
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
        <div>
          <label htmlFor="matricula">Matrícula:</label>
          <input
            type="text"
            id="matricula"
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
            onBlur={() => handleBlur('matricula')}
            placeholder="Matrícula"
            maxLength="10"
            style={{ borderColor: errors.matricula ? 'red' : '' }}
          />
          {errors.matricula && <p className="erros">{errors.matricula}</p>}
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
