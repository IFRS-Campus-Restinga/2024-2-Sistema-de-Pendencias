import React, { useState, useEffect, useMemo } from 'react';
import './ListarCurso.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa.png";
import X from "../../../../assets/x-branco.png";
import cursoService from '../../../../services/cursoService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Para decodificar o token e pegar o ID do usuário
import AdicionarCurso from "../../../../assets/adicionar-livro.png";
import LupaBranca from "../../../../assets/lupa-branca.png";

const ListarCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState(''); // Campo único de filtro
  const [ordenacao, setOrdenacao] = useState({ coluna: '', ordem: 'asc' });

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

  
  // Função para remover acentos (para o filtro buscar tudo)
  const removeAcentos = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  
  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter((curso) => {
      const filtroNormalizado = removeAcentos(filtro.toLowerCase());
      
      return (
        removeAcentos(curso.nome.toLowerCase()).includes(filtroNormalizado) ||
        removeAcentos(curso.modalidade.toLowerCase()).includes(filtroNormalizado) ||
        curso.carga_horaria.toString().includes(filtro)
      );
    });
  
    setCursosFiltrados(cursosFiltrados);
  };
  

  // Limpa o filtro
  const limparBusca = () => {
    setFiltro('');
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

  // Usa useMemo para evitar refazer a filtragem e ordenação toda vez
  const cursosParaExibir = useMemo(() => {
    return cursosFiltrados;
  }, [cursosFiltrados]);

  return (
    <>
      <FormContainer titulo='Lista de Cursos' comprimento='90%'
        onSubmit={(e) => {
          e.preventDefault();
          filtrarCursos();
        }}>

        <div className='containerListarCursos'>
          <div className="buscar-bar">
            <Input
              tipo='search'
              valor={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              textoAjuda={'Buscar por modalidade, curso ou carga horária...'}
            />
            <img
              className='iconesBuscarCurso'
              src={LupaBranca}
              onClick={filtrarCursos}
              title='Buscar'
            />
            <img
              className='iconesBuscarCurso'
              src={X}
              onClick={limparBusca}
              title='Limpar Busca'
            />
          </div>
          <div className='adicionarCurso'>
            <img
              className='iconeAdicionarCurso'
              src={AdicionarCurso}
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`)}
              title='Cadastrar Curso'
            />
          </div>
        </div>

        <div className='tabelaContainerListarCursos'>
          <table className='tabelaListarCursos'>
            <thead>
              <tr>
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
                      alt="Editar"
                      onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`, { state: { curso } })}
                      title="Editar"
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
