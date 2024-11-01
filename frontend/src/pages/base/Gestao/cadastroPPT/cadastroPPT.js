import React, { useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import "./cadastroPPT.css";

const CadastroPPT = () => {
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    curso: "",
    turma: "",
    disciplina: "",
    docente: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^\d+$/.test(formData.matricula)) newErrors.matricula = true;
    if (!/^[a-zA-Z\s]+$/.test(formData.nome)) newErrors.nome = true;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Formulário enviado:", formData);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} titulo="Cadastro EMI - PPT">
      <Input
        tipo="text"
        textoAjuda="Matrícula"
        valor={formData.matricula}
        onChange={handleChange}
        erro={errors.matricula}
        name="matricula"
        width="100%" 
      />
      <Input
        tipo="text"
        textoAjuda="Nome"
        valor={formData.nome}
        onChange={handleChange}
        erro={errors.nome}
        name="nome"
        width="100%" 
      />
      <select name="curso" onChange={handleChange} value={formData.curso}>
        <option value="">Selecione o Curso</option>
        <option value="curso1">Curso 1</option>
        <option value="curso2">Curso 2</option>
      </select>
      <select name="turma" onChange={handleChange} value={formData.turma}>
        <option value="">Selecione a Turma</option>
        <option value="turma1">Turma 1</option>
        <option value="turma2">Turma 2</option>
      </select>
      <select
        name="disciplina"
        onChange={handleChange}
        value={formData.disciplina}
      >
        <option value="">Selecione a Disciplina</option>
        <option value="disciplina1">Disciplina 1</option>
        <option value="disciplina2">Disciplina 2</option>
      </select>
      <select name="docente" onChange={handleChange} value={formData.docente}>
        <option value="">Selecione o Docente</option>
        <option value="docente1">Docente 1</option>
        <option value="docente2">Docente 2</option>
      </select>
      <textarea
        name="observacoes"
        placeholder="Observações"
        value={formData.observacoes}
        onChange={handleChange}
      />
      <Button color="#28A745" text="Continuar" tipo="submit" />
    </FormContainer>
  );
};

export default CadastroPPT;
