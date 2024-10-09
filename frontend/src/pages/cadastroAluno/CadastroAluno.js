import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./CadastroAluno.css";
import Button from "../../components/Button/Button";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MainContainer from "../../components/MainContainer/mainContainer";

const CadastroAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: '',
    cpf: '',
    dataNascimento: '',
    matricula: '',
    telefone: ''
  });

  const fetchAlunos = async () => {
    const response = await axios.get('http://localhost:8000/api/visualizar-alunos/');
    setAlunos(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-aluno/', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao cadastrar aluno!', error);
    }
  };

  // useEffect(() => {
  //   fetchAlunos();
  // }, []);

  return (
        <form onSubmit={handleSubmit}>
          <h3>Cadastro Aluno</h3>
          <hr/>
          <br/>
          <h3 className="subtitulo_esquerda">Dados Pessoais</h3>
          <div>
            <label className="perfil">Perfil:</label>
            <br/>
            <div className="radio-container">
              <label>
                <input type="radio" value="Aluno" checked={formData.perfil === 'Aluno'}
                       onChange={(e) => setFormData({...formData, perfil: e.target.value})}/>
                <span>Aluno</span>
              </label>
              <label>
                <input type="radio" value="Professor" checked={formData.perfil === 'Professor'}
                       onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                />
                <span>Professor</span>
              </label>
              <label>
                <input type="radio" value="Registros Escolares" checked={formData.perfil === 'Registros Escolares'}
                       onChange={(e) => setFormData({...formData, perfil: e.target.value})}/>
                <span>Registros Escolares</span>
              </label>
              <label>
                <input type="radio" value="Gestão Escolar" checked={formData.perfil === 'Gestão Escolar'}
                       onChange={(e) => setFormData({...formData, perfil: e.target.value})}/>
                <span>Gestão Escolar</span>
              </label>
              <label>
                <input type="radio" value="Coordenador" checked={formData.perfil === 'Coordenador'}
                       onChange={(e) => setFormData({...formData, perfil: e.target.value})}/>
                <span>Coordenador</span>
              </label>
            </div>

          </div>
          <div>
            <label htmlFor="nome">Nome completo:</label>
            <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome"
            />
          </div>
          <div>
            <label htmlFor="cpf">CPF:</label>
            <input
                type="text"
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                placeholder="CPF"
            />
          </div>
          <div>
            <label htmlFor="dataNascimento">Data de Nascimento:</label>
            <input
                type="date"
                id="dataNascimento"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                placeholder="Data de Nascimento"
            />
          </div>
          <div>
            <label htmlFor="matricula">Matrícula:</label>
            <input
                type="text"
                id="matricula"
                value={formData.matricula}
                onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                placeholder="Matrícula"
            />
          </div>
          <h3 className="subtitulo_esquerda">Dados de Contato</h3>
          <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="telefone">Telefone:</label>
            <input
                type="text"
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
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
        /* <h1>Alunos cadastrados (somente para testar)</h1>
        <ul>
          {alunos.map((aluno) => (
              <li key={aluno.id}>
                {aluno.nome} - {aluno.email} - {aluno.perfil} - {aluno.cpf} - {aluno.matricula} - {aluno.telefone}
              </li>
          ))}
        </ul> */
  );
};

export default CadastroAluno;
