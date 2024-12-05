import React, { useState, useEffect } from 'react';
import './ListarCurso.css';
import Adicionar from '../../../../assets/icone-adicionar-curso.png'
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa-branca.png"; // Ajuste o caminho conforme necessário
import X from "../../../../assets/x-branco.png"; // Ajuste o caminho conforme necessário
import cursoService from '../../../../services/cursoService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Para decodificar o token e pegar o ID do usuário
import Tabela from '../../../../components/Tabela/Tabela';
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS';
import loading from '../../../../assets/loading-cursos.png'

const ListarCursos = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [filtroGeral, setFiltroGeral] = useState(''); // Campo único de filtro

  const navigate = useNavigate();

  // Função para buscar os cursos
  const fetchCursos = async () => {
    try {
      const response = await cursoService.list('lista');

      setCursos(response.data);
      setCursosFiltrados(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };
  
  // Função para remover acentos (para o filtro buscar tudo)
  const removeAcentos = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  
  const filtrarCursos = () => {
    const cursosFiltrados = cursos.filter(curso => (
        curso.nome.toLowerCase().includes(filtroGeral.toLowerCase()) || 
        curso.modalidade.toLowerCase().includes(filtroGeral.toLowerCase()) ||
        curso.carga_horaria === Number(filtroGeral)
    ));
    setCursosFiltrados(cursosFiltrados);
  };
  
  // Limpa o filtro
  const limparBusca = () => {
    setFiltroGeral('');
    fetchCursos();
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  if (isLoading) return <LoadingIFRS icone={loading}/>

  return (
    <>
      <FormContainer titulo='Lista de Cursos' comprimento='90%'>
        <div className='containerBuscarCurso'>

            <div class="buscaBarCurso">
              <Input
              tipo='search'
              valor={filtroGeral}
              onChange={(e) => setFiltroGeral(e.target.value)}
              textoAjuda={'Buscar'}
              />
              <img
              className='iconesBuscarCurso'
              src={Lupa}
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
              src={Adicionar}
              className='iconeAdicionarCurso'
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroCurso`)}
              title='Cadastrar Curso'
              />
          </div>       
        </div>
        <Tabela listaFiltrada={cursosFiltrados}/>
      </FormContainer>
    </>
  );
};

export default ListarCursos;
