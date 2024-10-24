import React, { useState, useEffect } from 'react';
import Button from "../../../../components/Button/Button";
import "./cadastroEmiPed.css";
import { PEDService} from "../../../../services/emiPedService"; // CSS para a página

const CadastroEmiPed = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    curso: '',
    turma: '',
    turmaPedRecuperar: '',
    disciplina: '',
    trimestreRecuperar: '',
    docenteResponsavel: '',
    observacao: ''
  });

  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [message, setMessage] = useState('');

  // Função para buscar cursos disponíveis
  // const fetchCursos = async () => {
  //   try {
  //     const response = await PEDService.create(formData)
  //     console.log(response)

  //     setCursos(data);
  //   } catch (error) {
  //     console.error('Erro ao buscar cursos!', error);
  //     setMessage('Erro ao buscar cursos!'); // Adiciona mensagem de erro
  //   }
  // };

  // Função para buscar disciplinas disponíveis
  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listar-disciplinas/');
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas!', error);
      setMessage('Erro ao buscar disciplinas!');
    }
  };

  // Função para buscar docentes disponíveis
  const fetchDocentes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listar-docentes/');
      const data = await response.json();
      setDocentes(data);
    } catch (error) {
      console.error('Erro ao buscar docentes!', error);
      setMessage('Erro ao buscar docentes!');
    }
  };

  useEffect(() => {
    // fetchCursos();
    // fetchDisciplinas();
    // fetchDocentes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    try {
      const response = await PEDService.create(formData)

      if (response) {
        setMessage('Cadastro EM - PED realizado com sucesso!');
        setFormData({
          matricula: '',
          nome: '',
          curso: '',
          turma: '',
          turmaPedRecuperar: '',
          disciplina: '',
          trimestreRecuperar: '',
          docenteResponsavel: '',
          observacao: ''
        });
      }
    } catch (error) {
      setMessage('Erro ao cadastrar EM - PED!');
      console.error('Erro ao cadastrar EM - PED!', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-em-ped">
        <h3>Cadastro EMI - PED</h3>
        <hr />

        <div className="form-item">
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
        <div className="form-item">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome"
            required
          />
        </div>
        <div className="form-item">
          <label htmlFor="curso">Curso:</label>
          <select
            id="curso"
            value={formData.curso}
            onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
            required
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="turma">Turma:</label>
          <input
            type="text"
            id="turma"
            value={formData.turma}
            onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
            placeholder="Turma"
            required
          />
        </div>
        <div className="form-item">
          <label htmlFor="turmaPedRecuperar">Turma da PED a Recuperar:</label>
          <input
            type="text"
            id="turmaPedRecuperar"
            value={formData.turmaPedRecuperar}
            onChange={(e) => setFormData({ ...formData, turmaPedRecuperar: e.target.value })}
            placeholder="Turma da PED a Recuperar"
            required
          />
        </div>
        <div className="form-item">
          <label htmlFor="disciplina">Disciplina:</label>
          <select
            id="disciplina"
            value={formData.disciplina}
            onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
            required
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="trimestreRecuperar">Trimestre a Recuperar:</label>
          <input
            type="text"
            id="trimestreRecuperar"
            value={formData.trimestreRecuperar}
            onChange={(e) => setFormData({ ...formData, trimestreRecuperar: e.target.value })}
            placeholder="Trimestre a Recuperar"
            required
          />
        </div>
        <div className="form-item">
          <label htmlFor="docenteResponsavel">Docente Responsável:</label>
          <select
            id="docenteResponsavel"
            value={formData.docenteResponsavel}
            onChange={(e) => setFormData({ ...formData, docenteResponsavel: e.target.value })}
            required
          >
            <option value="">Selecione um docente</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="observacao">Observação:</label>
          <textarea
            id="observacao"
            value={formData.observacao}
            onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
            placeholder="Observação"
          />
        </div>
        <div className="botaoContainer">
          <Button
            width="30%"
            color="#28A745"
            text="Cadastrar"
            type="submit"
          />
        </div>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default CadastroEmiPed;
