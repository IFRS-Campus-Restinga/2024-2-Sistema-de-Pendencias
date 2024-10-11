//import React, { useState } from 'react';
//import axios from 'axios';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./CadastroCurso.css";

const CadastroCurso = () => {
    // const handleCursoChange = (e) => {
    //     setCurso({ ...curso, [e.target.name]: e.target.value });
    // };

    // const handleTurmaAdd = () => {
    //     if (newTurma.trim() && !turmas.some(turma => turma.codigo === newTurma)) {
    //         setTurmas([...turmas, { codigo: newTurma }]);
    //         setNewTurma('');
    //     } else {
    //         alert('Turma já existe ou está vazia!');
    //     }
    // };

    // const handleTurmaDelete = (index) => {
    //     const updatedTurmas = turmas.filter((_, i) => i !== index);
    //     setTurmas(updatedTurmas);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log('Curso enviado:', curso);
    //     console.log('Turmas:', turmas);
        
    //     // Exemplo de chamada API (descomente quando a API estiver pronta)
    //     // try {
    //     //     const response = await axios.post('/api/cursos', { curso, turmas });
    //     //     console.log('Resposta da API:', response.data);
    //     // } catch (error) {
    //     //     console.error('Erro ao salvar o curso:', error);
    //     // }
    // };

    return (
        <div>
            <h1>Cadastro Curso</h1>
            <form>
                <div>
                    <label>Modalidade:</label>
                    <div>
                        <label>
                            <input type="radio" name="modalidade" value="ProEja" /> ProEja
                        </label>
                        <label>
                            <input type="radio" name="modalidade" value="Integrado" /> Integrado
                        </label>
                    </div>
                </div>
    
                <div>
                    <label htmlFor="nome_curso">Nome do Curso:</label>
                    <input type="text" name="nome_curso" id="nome_curso" required />
                </div>
    
                <div>
                    <label htmlFor="carga_horaria">Carga Horária:</label>
                    <input type="text" name="carga_horaria" id="carga_horaria" required />
                </div>
    
                <div>
                    <h3>Adicionar Turma:</h3>
                    <input type="text" placeholder="Código da Turma" />
                    <button type="button">Adicionar</button>
                </div>
    
                <ul>
                    <li>
                        Código da Turma
                        <button type="button">Excluir</button>
                    </li>
                </ul>
    
                <button type="submit">Salvar Curso</button>
            </form>
    
            <h2>Lista das Turmas já criadas:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Código da Turma</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Código da Turma</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
    
    
};


export default CadastroCurso;
