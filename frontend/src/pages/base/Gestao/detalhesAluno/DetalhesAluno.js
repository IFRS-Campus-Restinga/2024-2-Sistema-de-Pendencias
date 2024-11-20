import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import "./DetalhesAluno.css"


const DetalhesAluno = () => {
    const location = useLocation();
    const { state } = location || {};  // Recupera o estado passado

    if (!state) {
        return <div style={{margin: 'auto'}}>Nenhum aluno foi selecionado.</div>;
    }

    return (
        <FormContainer comprimento="70%" titulo={"Detalhes do Aluno"}>
            <p className="detalhe-aluno"><strong>Status:</strong> {state.ativo}</p>
            <p className="detalhe-aluno"><strong>Nome:</strong> {state.nome}</p>
            <p className="detalhe-aluno"><strong>Email:</strong> {state.email}</p>
            <p className="detalhe-aluno"><strong>Matricula:</strong> {state?.matricula}</p>
        </FormContainer>
    );
};

export default DetalhesAluno;
