import React, { useState, useEffect } from 'react';
import './ListarObservacoes.css'; // Pode criar um CSS específico
import { observacaoService } from '../../../../services/observacaoService'; // Serviço para obter as observações
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../../../components/Tabela/Tabela'; // Componente de Tabela para exibir as observações
import Input from '../../../../components/Input/Input'; // Componente de Input
import Lupa from "../../../../assets/lupa-branca.png"; // Imagem de lupa para buscar
import X from "../../../../assets/x-branco.png"; // Imagem para limpar a busca

const ListarObservacoes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [observacoes, setObservacoes] = useState([]); // Lista das observações
  const [observacoesFiltradas, setObservacoesFiltradas] = useState([]); // Lista filtrada
  const [filtroGeral, setFiltroGeral] = useState(''); // Filtro de pesquisa

  const navigate = useNavigate();

  // Função para buscar as observações
  const fetchObservacoes = async () => {
    try {
      const response = await observacaoService.list(); // Método para listar observações
      setObservacoes(response.data);
      setObservacoesFiltradas(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar observações:', error);
      toast.error('Erro ao buscar observações. Tente novamente.', {
        position: 'bottom-center',
        autoClose: 3000,
        style: { backgroundColor: '#d11c28', color: '#fff' },
      });
    }
  };

  // Função para filtrar as observações com base no filtro
  const filtrarObservacoes = () => {
    const observacoesFiltradas = observacoes.filter(observacao => (
      observacao.parecer.toLowerCase().includes(filtroGeral.toLowerCase()) ||
      observacao.status.toLowerCase().includes(filtroGeral.toLowerCase())
    ));
    setObservacoesFiltradas(observacoesFiltradas);
  };

  // Limpa o filtro
  const limparBusca = () => {
    setFiltroGeral('');
    fetchObservacoes();
  };

  useEffect(() => {
    fetchObservacoes();
  }, []);

  if (isLoading) return <div>Carregando...</div>; // Exibição de carregamento

  return (
    <>
      <ToastContainer />
      <div className="containerBuscarObservacao">
        <div className="buscaBarObservacao">
          <Input
            tipo="search"
            valor={filtroGeral}
            onChange={(e) => setFiltroGeral(e.target.value)}
            textoAjuda="Buscar Observações"
          />
          <img
            className="iconesBuscarObservacao"
            src={Lupa}
            onClick={filtrarObservacoes}
            title="Buscar"
          />
          <img
            className="iconesBuscarObservacao"
            src={X}
            onClick={limparBusca}
            title="Limpar Busca"
          />
        </div>
      </div>

      <Tabela listaFiltrada={observacoesFiltradas} editar={true} visualizar={true} />
    </>
  );
};

export default ListarObservacoes;
