import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observacaoService } from '../../../../services/observacaoService';
import './DetalhesObservacoes.css';
import Button from '../../../../components/Button/Button';
import FormContainer from '../../../../components/FormContainer/FormContainer';

const DetalhesObservacoes = () => {
  const { idObservacao} = useParams();
  const { idUsuario } = useParams();
  const [observacao, setObservacao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObservacao = async () => {
      try {
        const data = await observacaoService.visualizar(idObservacao);
        if (data) {
          setObservacao(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar observação:', error);
        setIsLoading(false);
      }
    };

    fetchObservacao();
  }, [idObservacao]);

  if (isLoading) return <div>Carregando...</div>;
  if (!observacao) return <div>Observação não encontrada.</div>;

  const handleEditar = () => {
    navigate(`/sessao/Professor/${idUsuario}/editarObservacao/${idObservacao}`)
  };

  return (
    <FormContainer comprimento="70%" titulo="Detalhes da Observação">
      <p><strong>Status:</strong> {observacao.status}</p>
      <p><strong>Parecer:</strong> {observacao.parecer}</p>
      <p><strong>Data de Inserção:</strong> {new Date(observacao.data_insercao).toLocaleString()}</p>
      <Button tipo="button" text="Editar Observação" onClick={handleEditar} />
      <Button tipo="button" text="Voltar" onClick={() => window.history.back()} />
    </FormContainer>
  );
};

export default DetalhesObservacoes;