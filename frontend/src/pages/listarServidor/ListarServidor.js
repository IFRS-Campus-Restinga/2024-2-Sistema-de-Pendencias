import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListarServidor.css';
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListarServidor = () => {
  const [servidores, setServidores] = useState([]);
  const [servidoresFiltrados, setServidoresFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeFiltro, setNomeFiltro] = useState('');

  const perfilMap = {
    1: 'Gestão Escolar',
    2: 'Registros Escolares',
    4: 'Coordenador',
    5: 'Professor'
  };

  const fetchServidores = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/listar-servidores/');
      const todosServidores = [
        ...response.data.gestao_escolar,
        ...response.data.registro_escolar,
        ...response.data.coordenadores,
        ...response.data.professores,
      ];
      setServidores(todosServidores);
      setServidoresFiltrados(todosServidores);
    } catch (error) {
      console.error('Erro ao buscar servidores:', error);
    }
  };

  useEffect(() => {
    fetchServidores();
  }, []);

  const ordenarPorColuna = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
    const servidoresOrdenados = [...servidoresFiltrados].sort((a, b) => {
      let valorA = a[coluna];
      let valorB = b[coluna];

      if (coluna === 'perfil') {
        valorA = perfilMap[a.perfil] || '';
        valorB = perfilMap[b.perfil] || '';
      }

      return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
    });

    setServidoresFiltrados(servidoresOrdenados);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  const filtrarServidores = () => {
    const servidoresFiltrados = servidores.filter(servidor =>
      servidor.nome.toLowerCase().includes(nomeFiltro.toLowerCase()) &&
      (!dataInicio || new Date(servidor.data_ingresso) >= new Date(dataInicio)) &&
      (!dataFim || new Date(servidor.data_ingresso) <= new Date(dataFim))
    );
    setServidoresFiltrados(servidoresFiltrados);
  };

  const limparBusca = () => {
    setDataInicio('');
    setDataFim('');
    setNomeFiltro('');
    fetchServidores();
  };

  return (
    <div className="container-listar-servidor">
      <h3>Lista de Servidores</h3>
      <hr />
      
      <div className="filtro-nome">
        <label>Filtrar por Nome:</label>
        <input
          type="text"
          value={nomeFiltro}
          onChange={(e) => setNomeFiltro(e.target.value)}
          style={{ width: '200px' }}
        />
      </div>

      <div className="filtro-periodo">
        <label>Buscar por período de ingresso:</label>
        <div>
          <label>Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <label>Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
      </div>

      <div className="botoes-busca">
      <Button
        text="Buscar"
        onClick={filtrarServidores}
        color="#4A4A4A"
      />
      <Button
        text="Limpar campos"
        onClick={limparBusca}
        color="#4A4A4A"
      />
    </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => ordenarPorColuna('perfil')}>
              Perfil
              {ordenacao.coluna === 'perfil' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('nome')}>
              Nome
              {ordenacao.coluna === 'nome' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('cpf')}>
              CPF
              {ordenacao.coluna === 'cpf' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('matricula')}>
              Matrícula
              {ordenacao.coluna === 'matricula' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('email')}>
              Email
              {ordenacao.coluna === 'email' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('data_ingresso')}>
              Data de Ingresso
              {ordenacao.coluna === 'data_ingresso' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {servidoresFiltrados.map((servidor) => (
            <tr key={servidor.id}>
              <td>{perfilMap[servidor.perfil] || 'Desconhecido'}</td>
              <td>{servidor.nome}</td>
              <td>{servidor.cpf}</td>
              <td>{servidor.matricula}</td>
              <td>{servidor.email}</td>
              <td>{servidor.data_ingresso ? new Date(servidor.data_ingresso).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarServidor;
