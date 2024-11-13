import React, { useState, useEffect } from 'react';
import './ListarCurso.css';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa.png"; // Ajuste o caminho conforme necessário
import { ToastContainer } from 'react-toastify';
import cursoService from '../../../../services/cursoService';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ListarCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [modalidadeFiltro, setModalidadeFiltro] = useState('');
  const [turmaFiltro, setTurmaFiltro] = useState('');

  const navigate = useNavigate();

  const fetchCursos = async () => {
    try {
      const response = await cursoService.list();
      setCursos(response.data);
      setCursosFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter(curso =>
      (!nomeFiltro || curso.nome.toLowerCase().includes(nomeFiltro.toLowerCase())) &&
      (!modalidadeFiltro || curso.modalidade === modalidadeFiltro) &&
      (!turmaFiltro || (curso.turmas && curso.turmas.some(turma => turma.numero.toLowerCase().includes(turmaFiltro.toLowerCase()))))
    );
    setCursosFiltrados(cursosFiltrados);
  };

  const limparBusca = () => {
    setNomeFiltro('');
    setModalidadeFiltro('');
    setTurmaFiltro('');
    fetchCursos();
  };

  const ordenarPorColuna = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';

    const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
      let valorA = a[coluna] || '-';
      let valorB = b[coluna] || '-';
      return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
    });

    setCursosFiltrados(cursosOrdenados);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  const handleEditCurso = (cursoId) => {
    // Quando o usuário clicar na lupa, redireciona para a página de cadastro de curso (mas com os dados carregados)
    navigate(`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`, { state: { cursoId } });
  };

  return (
    <>
      <ToastContainer />
      <FormContainer titulo='Lista de Cursos' comprimento='90%'>
        <section className='sectionListarCursos'>
          <div className='divListarCursos'>
            <div className="filtrosContainer">
              <span className="spanListarCursos">
                <label className='labelListarCursos'>Filtrar por Nome do Curso</label>
                <Input tipo='text' valor={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
              </span>
              <span className="spanListarCursos">
                <label className='labelListarCursos'>Filtrar por Modalidade</label>
                <select
                  className='selectListarCursos'
                  value={modalidadeFiltro}
                  onChange={(e) => setModalidadeFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Integrado">Integrado</option>
                  <option value="ProEJA">ProEJA</option>
                </select>
              </span>
            </div>
          </div>
          <div className='divListarCursos'>
            <Button text="Buscar" onClick={filtrarCursos} />
            <Button text="Limpar campos" onClick={limparBusca} color="#4A4A4A" />
            <Link to={`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`}>
              <Button text='Adicionar Novo' />
            </Link>
          </div>
        </section>
        <div className='tabelaContainerListarCursos'>
          <table className='tabelaListarCursos'>
            <thead className='cabecalhoListarCursos'>
              <tr className='linhaListarCursos'>
                <th onClick={() => ordenarPorColuna('modalidade')}>Modalidade</th>
                <th onClick={() => ordenarPorColuna('nome')}>Nome do Curso</th>
                <th onClick={() => ordenarPorColuna('carga_horaria')}>Carga Horária</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.modalidade}</td>
                  <td>{curso.nome}</td>
                  <td>{curso.carga_horaria}</td>
                  <td className='icone-container'>
                    <img
                      className='iconeAcoes'
                      src={Lupa}
                      alt="Buscar"
                      onClick={() => handleEditCurso(curso.id)} // Chama a função de edição
                      title="Editar"
                      style={{ width: '16px', height: '16px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormContainer>
    </>
  );
};

export default ListarCursos;
