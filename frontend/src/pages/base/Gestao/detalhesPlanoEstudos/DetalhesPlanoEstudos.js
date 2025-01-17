import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DetalhesPlanoEstudos.css'
import LogoIFRS from '../../../../assets/logo-ifrs-colorido.png';

const DetalhesPlanoEstudos = () => {
  const location = useLocation();
  const [planoEstudo, setPlanoEstudo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = location
  const modalidade = location.pathname.split('/')[5]

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await PlanoEstudosService.buscar(state.plano_estudos, 'detalhes', modalidade);

        if (res.status !== 200) throw new Error(res)

        setPlanoEstudo(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar os dados do plano de estudos ou da PED.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) return <div>Carregando...</div>;

  const handleEditar = async () => {
    try {
      const res = await PlanoEstudosService.editar(state.plano_estudos, modalidade, {aprovado: true})

      if (res.status !== 200) throw new Error(res)
      
      toast.success("Plano de estudos aprovado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' }
        });    } catch (error) {
      
    }
  }

  return (
    <>
      <ToastContainer />
      <FormContainer titulo="Detalhes do Plano de Estudos">
        <div className='divPlanoEstudos'>
          <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
          <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
          <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>
        </div>
        <Button text="Aprovar" onClick={handleEditar} disabled={planoEstudo.aprovado}/>
      </FormContainer>
    </>
  );
};

export default DetalhesPlanoEstudos;
