import React, { useState } from "react";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer"; // Importe o FormContainer
import "./cadastroPPT.css";
import { PPTService } from "../../../../services/emiPptService"

const CadastroPPT = () => {
  const [formData, setFormData] = useState({
    alunoEmail: "",
    nome: "",
    curso: "",
    disciplinaId: "",
    turma: "",
    turmaProgressao: "",
    professorId: "",
    dataInicio: "",
    dataFim: "",
    situacao: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(formData.nome)) newErrors.nome = true;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const response = await PPTService.create(formData);
      console.log("Formulário enviado:", formData);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} titulo="Cadastro EMI - PPT">
      {/* <Input
        tipo="text"
        textoAjuda="Matrícula"
        valor={formData.matricula || ''}
        onChange={handleChange}
        erro={errors.matricula}
        name="matricula"
        width="100%" 
      />
      <Input
        tipo="text"
        textoAjuda="Nome"
        valor={formData.nome || ''}
        onChange={handleChange}
        erro={errors.nome}
        name="nome"
        width="100%" 
      /> */}
      Email do Aluno: 
      <input type="text" name="alunoEmail" onChange={handleChange}></input>
      Nome: 
      <input type="text" name="nome" onChange={handleChange}></input>
      Curso:
      <select name="curso" onChange={handleChange} value={formData.curso}>
        <option value="">Selecione o Curso</option>
        <option value="curso1">Curso 1</option>
        <option value="curso2">Curso 2</option>
      </select>
      Disciplina:
      <select
        name="disciplinaId"
        onChange={handleChange}
        value={formData.disciplinaId}
      >
        <option value="">Selecione a Disciplina</option>
        <option value="1">Disciplina 1</option>
        <option value="2">Disciplina 2</option>
      </select>
      Turma:
      <select name="turma" onChange={handleChange} value={formData.turma}>
        <option value="">Selecione a Turma</option>
        <option value="1">Turma 1</option>
        <option value="2">Turma 2</option>
      </select>
      Turma de Progressão:
      <select name="turmaProgressao" onChange={handleChange} value={formData.turmaProgressao}>
        <option value="">Selecione a Turma Progressão</option>
        <option value="1">Turma 1</option>
        <option value="2">Turma 2</option>
      </select>
      Docente:
      <select name="professorId" onChange={handleChange} value={formData.professorId}>
        <option value="">Selecione o Docente</option>
        <option value="1">Docente 1</option>
        <option value="2">Docente 2</option>
      </select>
      Situação:
      <input type="text" name="situacao" onChange={handleChange}></input>
      Data Inicio:
      <input name="dataInicio" onChange={handleChange} value={formData.dataInicio} type="date"></input>
      Data Fim:
      <input name="dataFim" onChange={handleChange} value={formData.dataFim} type="date"></input>
      Observações:
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
