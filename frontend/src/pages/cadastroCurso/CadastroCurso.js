import React, { useState } from 'react';
import cursoService from '../../services/cursoService'; 
import './CadastroCurso.css'; 

const CadastroCurso = () => {
    const [formData, setFormData] = useState({
        modalidade: '',
        nome_curso: '',
        carga_horaria: ''
    });

    const envioHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await cursoService.create(formData);
            if (res && res.status) {
                if (res.status === 200) {
                    alert('Curso cadastrado com sucesso!');
                } else {
                    alert('Erro ao cadastrar curso: ' + (res.data ? res.data.message : 'Erro desconhecido'));
                }
            } else {
                alert('Erro na requisição: resposta indefinida.');
            }
        } catch (error) {
            if (error.response) {
                alert(`Erro no servidor: ${error.response.data.error || 'Erro desconhecido'}`);
            } else if (error.request) {
                alert("Nenhuma resposta do servidor.");
            } else {
                alert(`Erro na requisição: ${error.message}`);
            }
            console.error("Erro ao enviar os dados:", error);
        }
    };

    return (
        <div className="container">
            <h1>Cadastro Curso</h1>
            <form onSubmit={envioHandler}>
                <div>
                    <label>Modalidade:</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="modalidade"
                                value="ProEja"
                                onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                            /> ProEja
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="modalidade"
                                value="Integrado"
                                onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                            /> Integrado
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="nome_curso">Nome do Curso:</label>
                    <input
                        type="text"
                        name="nome_curso"
                        id="nome_curso"
                        required
                        onChange={(e) => setFormData({ ...formData, nome_curso: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="carga_horaria">Carga Horária:</label>
                    <input
                        type="text"
                        name="carga_horaria"
                        id="carga_horaria"
                        required
                        onChange={(e) => setFormData({ ...formData, carga_horaria: e.target.value })} 
                    />
                </div>

                <button type="submit">Salvar Curso</button>
            </form>
        </div>
    );

};


export default CadastroCurso;
