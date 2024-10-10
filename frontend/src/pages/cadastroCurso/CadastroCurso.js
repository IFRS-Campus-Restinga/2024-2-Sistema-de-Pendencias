import React, { useState } from 'react';
import cursoService from '../../services/cursoService'; 
import './CadastroCurso.css'; 
import Switch from '../../components/Switch/Switch';
import Button from '../../components/Button/Button';

const CadastroCurso = () => {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [modalidade, setModalidade] = useState('');

  const modalidades = [
    { value: 'PROEJA', label: 'PROEJA' },
    { value: 'EMI', label: 'EMI' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cadastrar-curso', {
        nome,
        carga_horaria: cargaHoraria,
        modalidade
      });
      console.log('Curso cadastrado com sucesso', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar curso', error);
    }
  };

    return (
        <form className='form' onSubmit={envioHandler}>
            <h1>Cadastro Curso</h1>
                <h4>Modalidade</h4>
            <div className='containerOpcoes'>
                    <label className='modalidadeLabel' htmlFor='Proeja'>
                    <span className='labelTexto'>ProEja</span>
                        <input
                            type="radio"
                            name="Proeja"
                            value="ProEja"
                            onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                        />
                    </label>
                    <label className='modalidadeLabel' htmlFor='Integrado' >
                    <span className='labelTexto'>Integrado</span>
                        <input
                            type="radio"
                            name="modalidade"
                            value="Integrado"
                            onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                        />
                    </label>
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
            <Button
              width="30%"
              color="#28A745"
              text="Cadastrar"
              onClick={envioHandler}
            />
        </form>
    );
    
};

export default CadastroCurso;
