import React, { useState, useEffect } from 'react';
import './ListarObservacoes.css';
import { observacaoService } from '../../../../services/observacaoService';
import { useNavigate, useParams } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tabela from '../../../../components/Tabela/Tabela'; 
import Input from '../../../../components/Input/Input'; 
import Lupa from "../../../../assets/lupa-branca.png";
import X from "../../../../assets/x-branco.png";
import Adicionar from "../../../../assets/icone-adicionar-curso.png";
import FormContainer from '../../../../components/FormContainer/FormContainer';

const ListarObservacoes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [observacoes, setObservacoes] = useState([]);
  const [observacoesFiltradas, setObservacoesFiltradas] = useState([]);
  const [filtroGeral, setFiltroGeral] = useState('');
  const navigate = useNavigate();
  const { idUsuario } = useParams(); // Obter dinamicamente o ID do usuário da URL

  // Função para buscar as observações
  const fetchObservacoes = async () => {
    try {
      const response = await observacaoService.list();
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

  // Função para filtrar as observações
  const filtrarObservacoes = () => {
    const observacoesFiltradas = observacoes.filter(observacao =>
      observacao.parecer.toLowerCase().includes(filtroGeral.toLowerCase()) ||
      observacao.status.toLowerCase().includes(filtroGeral.toLowerCase())
    );
    setObservacoesFiltradas(observacoesFiltradas);
  };

  // Limpa o filtro
  const limparBusca = () => {
    setFiltroGeral('');
    fetchObservacoes();
  };

  // Navegar para os detalhes de uma observação específica
  const handleVisualizar = (idObservacao) => {
    if (!idObservacao || isNaN(idObservacao)) {
      console.error('ID da observação está indefinido ou inválido.');
      return;
    }

    if (!idUsuario) {
      console.error('ID do usuário está indefinido.');
      return;
    }
  };

  useEffect(() => {
    fetchObservacoes();
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <ToastContainer />
      <FormContainer titulo={'Observações'}>
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
            <div className="adicionarObservacao">
              <img
                src={Adicionar}
                className="iconeAdicionarObservacao"
                onClick={() => navigate(`/sessao/Professor/${idUsuario}/adicionarObservacao`)}
                title="Adicionar Observação"
              />
            </div>
          </div>

          <Tabela
            listaFiltrada={observacoesFiltradas}
            editar={true}
            visualizar={true}
            onVisualizar={handleVisualizar}  // Passando o método de visualização para o Tabela
          />
      </FormContainer>
    </>
  );
};

export default ListarObservacoes;
