import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListarCurso.css';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import VisualizarIcon from "../../../../assets/visualizar-preto.png";
import OrdenarIcon from "../../../../assets/ordenar-branco.png";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListarCurso = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [modalidadeFiltro, setModalidadeFiltro] = useState('');
  const [nomeCursoFiltro, setNomeCursoFiltro] = useState('');
  const [nomeCoordenadorFiltro, setNomeCoordenadorFiltro] = useState('');
  const [turmaFiltro, setTurmaFiltro] = useState('');

  const fetchCursos = async () => {
    try {
      const response = await axios.get('/api/listar-cursos');
      setCursos(response.data);
      setCursosFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const ordenarPorColuna = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
    const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
      const valorA = a[coluna] || '-';
      const valorB = b[coluna] || '-';
      return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
    });

    setCursosFiltrados(cursosOrdenados);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  const limparFiltros = () => {
    setModalidadeFiltro('');
    setNomeCursoFiltro('');
    setNomeCoordenadorFiltro('');
    setTurmaFiltro('');
    fetchCursos();
    setOrdenacao({ coluna: '', ordem: 'asc' });
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter(curso =>
      (!modalidadeFiltro || curso.modalidade.includes(modalidadeFiltro)) &&
      (!nomeCursoFiltro || curso.nomeCurso.toLowerCase().includes(nomeCursoFiltro.toLowerCase())) &&
      (!nomeCoordenadorFiltro || curso.coordenador.toLowerCase().includes(nomeCoordenadorFiltro.toLowerCase())) &&
      (!turmaFiltro || curso.turma.includes(turmaFiltro))
    );
    setCursosFiltrados(cursosFiltrados);
  };

  return (
    <FormContainer titulo="Lista de Cursos">
      <ToastContainer />
      <div className='sectionListarCurso'>
        <div className='filtroListarCurso'>
          <span>
            <label>Nome do Curso</label>
            <input
              type='text'
              value={nomeCursoFiltro}
              onChange={(e) => setNomeCursoFiltro(e.target.value)}
            />
          </span>
          <span>
            <label>Modalidade</label>
            <select
              value={modalidadeFiltro}
              onChange={(e) => setModalidadeFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="integrado">Integrado</option>
              <option value="Proeja">Proeja</option>
            </select>
          </span>
          <span>
            <label>Coordenador</label>
            <input
              type='text'
              value={nomeCoordenadorFiltro}
              onChange={(e) => setNomeCoordenadorFiltro(e.target.value)}
            />
          </span>
          <span>
            <label>Turma</label>
            <input
              type='text'
              value={turmaFiltro}
              onChange={(e) => setTurmaFiltro(e.target.value)}
            />
          </span>
        </div>
        <div className='acaoListarCurso'>
          <Button text="Buscar" onClick={filtrarCursos} />
          <Button text="Limpar" onClick={limparFiltros} color="#4A4A4A" />
        </div>
      </div>
      <div className='tabelaContainerListarCurso'>
        <table className='tabelaListarCurso'>
          <thead>
            <tr>
              <th onClick={() => ordenarPorColuna('modalidade')}>Modalidade</th>
              <th onClick={() => ordenarPorColuna('nomeCurso')}>Nome do Curso</th>
              <th onClick={() => ordenarPorColuna('cargaHoraria')}>Carga Horária</th>
              <th onClick={() => ordenarPorColuna('coordenador')}>Coordenador</th>
              <th onClick={() => ordenarPorColuna('dataInicioCoordenador')}>Data Início Coordenador</th>
              <th onClick={() => ordenarPorColuna('turma')}>Turma</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursosFiltrados.map((curso) => (
              <tr key={`${curso.id}-${curso.nomeCurso}`}>
                <td>{curso.modalidade || '-'}</td>
                <td>{curso.nomeCurso || '-'}</td>
                <td>{curso.cargaHoraria || '-'}</td>
                <td>{curso.coordenador || '-'}</td>
                <td>{curso.dataInicioCoordenador || '-'}</td>
                <td>{curso.turma || '-'}</td>
                <td className='acoes'>
                  <img 
                    className='iconeAcoes'
                    src={VisualizarIcon} 
                    alt="Visualizar" 
                    title="Consultar"
                    onClick={() => console.log('Consultar curso')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FormContainer>
  );
};

export default ListarCurso;
