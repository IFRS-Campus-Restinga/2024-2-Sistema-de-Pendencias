import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observacaoService } from '../../../../services/observacaoService';
import './DetalhesObservacoes.css';
import Button from '../../../../components/Button/Button';
import FormContainer from '../../../../components/FormContainer/FormContainer';

const DetalhesObservacoes = () => {
    const { idObservacao } = useParams(); // Obtém o ID da observação da rota
    const [observacao, setObservacao] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <FormContainer comprimento="70%" titulo="Detalhes da Observação">
            <p><strong>ID:</strong> {observacao.id}</p>
            <p><strong>Status:</strong> {observacao.status}</p>
            <p><strong>Parecer:</strong> {observacao.parecer}</p>
            <p><strong>Data:</strong> {observacao.data}</p>
            <Button
                tipo="button"
                text="Voltar"
                onClick={() => window.history.back()}
            />
        </FormContainer>
    );
};

export default DetalhesObservacoes;
