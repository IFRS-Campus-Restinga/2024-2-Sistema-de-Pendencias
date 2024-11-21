import React, { useState, useEffect, useMemo } from 'react';
import './ListarCurso.css';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa.png"; // Ajuste o caminho conforme necessário
import X from "../../../../assets/x-branco.png"; // Ajuste o caminho conforme necessário
import Button from "../../../../components/Button/Button";  // Importe o componente Button
import cursoService from '../../../../services/cursoService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Para decodificar o token e pegar o ID do usuário

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

  // Filtra os cursos com base no critério de busca
  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter(curso => {
      const filtroLower = filtro.toLowerCase(); // Transformando o filtro em minúsculas para comparação

      // Verifica se algum campo contém a string filtrada (tanto texto quanto número)
      return (
        curso.nome.toLowerCase().includes(filtroLower) || 
        curso.modalidade.toLowerCase().includes(filtroLower) ||
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
      <FormContainer titulo='Lista de Cursos' comprimento='90%'> 

        <div className='containerListarCursos'>
          <div className="buscar-bar">
            <Input
              tipo='search'
              valor={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              textoAjuda={'Buscar por modalidade, curso ou carga horária...'}
            />
            <img
              className='iconesBuscar'
              src={Lupa}
              onClick={filtrarCursos}
              title='Buscar'
            />
            <img
              className='iconesBuscar'
              src={X}
              onClick={limparBusca}
              title='Limpar Busca'
            />
          </div>
          
          {/* Botão de "Adicionar Novo" com navegação para a tela de cadastro de curso */}
          <Button 
            text="Adicionar Novo" 
            onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`)} 
          />
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
