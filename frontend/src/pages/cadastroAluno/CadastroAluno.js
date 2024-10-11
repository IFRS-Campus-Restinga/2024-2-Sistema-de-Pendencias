import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./CadastroAluno.css";
import Button from "../../components/Button/Button";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CadastroAluno = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: 'Aluno', // Definindo o perfil como 'Aluno'
    cpf: '',
    dataNascimento: '',
    matricula: '',
    telefone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-aluno/', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao cadastrar aluno!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastro Aluno</h3>
      <hr/>

      {/* Seção de Dados Obrigatórios */}
      <h3 className="subtitulo_esquerda">Dados Obrigatórios</h3>
      <div>
        <label htmlFor="nome">Nome completo:</label>
        <input
          type="text"
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Nome"
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          required
        />
      </div>
      <div>
        <label htmlFor="matricula">Matrícula:</label>
        <input
          type="text"
          id="matricula"
          value={formData.matricula}
          onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
          placeholder="Matrícula"
          required
        />
      </div>

      {/* Seção de Dados Complementares */}
      <h3 className="subtitulo_esquerda">Dados Complementares</h3>
      <div>
        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          placeholder="CPF"
        />
      </div>
      <div>
        <label htmlFor="dataNascimento">Data de Nascimento:</label>
        <input
          type="date"
          id="dataNascimento"
          value={formData.dataNascimento}
          onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="telefone">Telefone:</label>
        <input
          type="text"
          id="telefone"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          placeholder="Telefone"
        />
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
  );
};

export default CadastroAluno;
