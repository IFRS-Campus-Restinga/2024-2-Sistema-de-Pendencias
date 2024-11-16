import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from 'react-toastify';
import "./planoEstudos.css";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { validarFormularioPlanoEstudos } from "./validacoes";
import { useParams } from "react-router-dom";

const Turnos = ['Manhã', 'Tarde', 'Noite', 'Integral'];
const FormaOferta = ['Presencial', 'EAD', 'Híbrido'];

const PlanoEstudos = () => {
  const { pedId } = useParams();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    forma_oferta: '',
    turno: '',
    parecer_pedagogico: '',
    ped: pedId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do formulário
    const erros = validarFormularioPlanoEstudos(formData);

    if (Object.keys(erros).length !== 0) {
      setErrors(erros); // Exibir erros
    } else {
      try {
        // Enviar dados para o serviço
        const res = await PlanoEstudosService.create(formData);

        if (res.status !== 201) throw new Error(res.response.data.mensagem);

        toast.success("Plano de estudos cadastrado com sucesso!", {
          position: "bottom-center",
          autoClose: 3000,
          style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
          progressStyle: { backgroundColor: '#fff' },
        });

        // Limpar formulário após sucesso
        setFormData({
          forma_oferta: '',
          turno: '',
          parecer_pedagogico: '',
        });

        setErrors({}); // Limpar erros
      } catch (error) {
        console.error('Erro ao cadastrar plano de estudos: ', error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer onSubmit={handleSubmit} titulo="Cadastro Plano de Estudos">
        {Object.keys(errors).length > 0 && (
          <p style={{ color: 'red' }}>*Preencha os campos obrigatórios</p>
        )}

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Forma de Oferta *
              <select
                className={errors.forma_oferta ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, forma_oferta: e.target.value })}
                value={formData.forma_oferta}
              >
                <option value="">Selecione a forma de oferta</option>
                {FormaOferta.map((forma, index) => (
                  <option key={index} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
              {errors.forma_oferta && (
                <p className="errorMessage">{errors.forma_oferta}</p>
              )}
            </label>

            <label className="labelCadastroPlanoEstudos">
              Turno *
              <select
                className={errors.turno ? 'errorSelectCadastroPlanoEstudos' : 'selectCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                value={formData.turno}
              >
                <option value="">Selecione o turno</option>
                {Turnos.map((turno, index) => (
                  <option key={index} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
              {errors.turno && <p className="errorMessage">{errors.turno}</p>}
            </label>
          </div>
        </section>

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Parecer Pedagógico *
              <textarea
                className={errors.parecer_pedagogico ? 'errorTextAreaCadastroPlanoEstudos' : 'textAreaCadastroPlanoEstudos'}
                onChange={(e) => setFormData({ ...formData, parecer_pedagogico: e.target.value })}
                value={formData.parecer_pedagogico}
                rows="3"
              />
              {errors.parecer_pedagogico && (
                <p className="errorMessage">{errors.parecer_pedagogico}</p>
              )}
            </label>
          </div>
        </section>

        <Button tipo="submit" text="Cadastrar" />
      </FormContainer>
    </>
  );
};

export default PlanoEstudos;
