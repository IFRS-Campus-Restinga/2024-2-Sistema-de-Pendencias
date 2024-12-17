import React, { useState, useEffect } from 'react';
import Adicionar from '../../../../assets/icone-adicionar-curso.png'
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Lupa from "../../../../assets/lupa-branca.png"; // Ajuste o caminho conforme necessário
import X from "../../../../assets/x-branco.png"; // Ajuste o caminho conforme necessário
import conselhoDeClasseService from '../../../../services/conselhoDeClasseService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Para decodificar o token e pegar o ID do usuário
import Tabela from '../../../../components/Tabela/Tabela';
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS';
import loading from '../../../../assets/loading-cursos.png'

const ListarConselhoDeClasse = () => {
  //const [isLoading, setIsLoading] = useState(true)
  const [conselhoDeClasse, setConselhoDeClasse] = useState([]);
  const [conselhoDeClasseFiltrados, setConselhoDeClasseFiltrados] = useState([]);
  const [filtroGeral, setFiltroGeral] = useState(''); // Campo único de filtro

  const navigate = useNavigate();

  // Função para buscar os cursos
  const fetchConselhoDeClasse = async () => {
    try {
      const response = await conselhoDeClasseService.listarConselhoDeClasse('lista');

      setConselhoDeClasse(response.data);
      setConselhoDeClasseFiltrados(response.data);
      //setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar conselho de classe:', error);
    }
  };
  
  // Função para remover acentos (para o filtro buscar tudo)
  const removeAcentos = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  
  const filtrarConselhoDeClasse = () => {
    const conselhoDeClasseFiltrados = conselhoDeClasse.filter(curso => (
        conselhoDeClasse.data_reuniao.toLowerCase().includes(filtroGeral.toLowerCase())
        
    ));
    setConselhoDeClasseFiltrados(conselhoDeClasseFiltrados);
  };
  
  // Limpa o filtro
  const limparBusca = () => {
    setFiltroGeral('');
    fetchConselhoDeClasse();
  };

  useEffect(() => {
    fetchConselhoDeClasse();
  }, []);

  //if (isLoading) return <LoadingIFRS icone={loading}/>

  return (
    <>
      <FormContainer titulo='Lista de Conselhos de Classe' comprimento='90%'>
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
              onClick={filtrarConselhoDeClasse}
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
              onClick={() => navigate(`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/conselhoDeClasse/cadastrarConselhoDeClasse`)}
              title='Cadastrar Curso'
              />
          </div>       
        </div>
        <Tabela listaFiltrada={conselhoDeClasseFiltrados} editar={true} visualizar={true}/>
      </FormContainer>
    </>
  );
};

export default ListarConselhoDeClasse;
