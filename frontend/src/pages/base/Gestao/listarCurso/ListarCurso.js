import React, { useState, useEffect, useMemo } from 'react';
import './ListarCurso.css';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa.png"; // Ajuste o caminho conforme necessário
import { ToastContainer } from 'react-toastify';
import cursoService from '../../../../services/cursoService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ListarCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [modalidadeFiltro, setModalidadeFiltro] = useState('');
  const [turmaFiltro, setTurmaFiltro] = useState('');

  const navigate = useNavigate();

  // Função para buscar os cursos
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

  // Filtra os cursos com base nos critérios
  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter(curso =>
      (!nomeFiltro || curso.nome.toLowerCase().includes(nomeFiltro.toLowerCase())) &&
      (!modalidadeFiltro || curso.modalidade === modalidadeFiltro) &&
      (!turmaFiltro || (curso.turmas && curso.turmas.some(turma => turma.numero.toLowerCase().includes(turmaFiltro.toLowerCase()))))
    );
    setCursosFiltrados(cursosFiltrados);
  };

  // Limpa os filtros
  const limparBusca = () => {
    setNomeFiltro('');
    setModalidadeFiltro('');
    setTurmaFiltro('');
    fetchCursos();
  };

  // Ordena os cursos por uma coluna
  const ordenarPorColuna = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';

    const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
      let valorA = a[coluna] || '-';
      let valorB = b[coluna] || '-';
      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return novaOrdem === 'asc' 
          ? valorA.localeCompare(valorB) 
          : valorB.localeCompare(valorA);
      }
      return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
    });

    setCursosFiltrados(cursosOrdenados);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  // Função para navegação de edição de curso
  const handleEditCurso = (curso) => {
    const usuarioId = jwtDecode(sessionStorage.getItem('token')).idUsuario;
    // Navegar para o formulário de edição, passando o ID do curso
    navigate(`/sessao/Gestão Escolar/${usuarioId}/cadastroCurso`, { state: { curso } });
  };

  // Usa useMemo para evitar refazer a filtragem e ordenação toda vez
  const cursosParaExibir = useMemo(() => {
    return cursosFiltrados;
  }, [cursosFiltrados]);

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
            <Button text='Adicionar Novo' onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`)} />
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
              {cursosParaExibir.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.modalidade}</td>
                  <td>{curso.nome}</td>
                  <td>{curso.carga_horaria}</td>
                  <td className='icone-container'>
                    <img
                      className='iconeAcoes'
                      src={Lupa}
                      alt="Buscar"
                      onClick={() => handleEditCurso(curso)} // Chama a função de edição
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
