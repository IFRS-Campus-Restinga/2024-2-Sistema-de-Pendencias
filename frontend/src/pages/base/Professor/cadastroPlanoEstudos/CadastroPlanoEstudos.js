import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CadastroPlanoEstudos.css";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { validarFormularioPlanoEstudos } from "./validacoes";

const Turnos = ["Manhã", "Tarde", "Noite", "Integral"];
const FormaOferta = ["Presencial", "EAD", "Híbrido"];

const CadastroPlanoEstudos = () => {
  const location = useLocation();
  const modalidade = location.pathname.split("/")[5]
  const { state } = location || {}; // Verifica se estamos editando ou criando
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    forma_oferta: "",
    turno: "",
    parecer_pedagogico: "",
    ped: state.id
  });

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const erros = validarFormularioPlanoEstudos(formData);

    if (Object.keys(erros).length > 0) {
      setErrors(erros);
    } else {
      try {
        let response;
        if (state.plano_estudos) {
          response = await PlanoEstudosService.editar(state.plano_estudos, modalidade, formData);
        } else {
          response = await PlanoEstudosService.criar(formData, modalidade);
        }

        if (response.status !== 200 && response.status !== 201) throw new Error(response.response.data.mensagem);

        // Exibe toast de sucesso
        toast.success(
          state.plano_estudos
            ? "Plano de estudos editado com sucesso!"
            : "Plano de estudos cadastrado com sucesso!",
          {
            position: "bottom-center",
            autoClose: 3000,
            style: {
              backgroundColor: "#28A745",
              color: "#fff",
              textAlign: "center",
            },
            progressStyle: { backgroundColor: "#fff" },
          }
        );

        // Limpa os campos do formulário após sucesso
        setFormData({
          forma_oferta: "",
          turno: "",
          parecer_pedagogico: "",
          ped: state.id
        });

        setErrors({}); // Limpa os erros
      } catch (error) {
        console.error(
          state.plano_estudos
            ? "Erro ao editar o plano de estudos"
            : "Erro ao cadastrar o plano de estudos",
          error
        );
        toast.error(
          "Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde."
        );
      }
    }
  };

  useEffect(() => {
    const fetchPlanoEstudo = async () => {
      if (state.plano_estudos) {
        try {
          const res = await PlanoEstudosService.buscar(state.plano_estudos, 'detalhes', modalidade);
          setFormData(res.data);
        } catch (error) {
          console.error("Erro ao buscar detalhes do plano de estudos", error);
        }
      }
    };

    fetchPlanoEstudo();
  }, [state]);

  return (
    <>
      <ToastContainer />
      <FormContainer
        onSubmit={handleSubmit}
        titulo={state.plano_estudos ? "Editar Plano de Estudos" : "Cadastrar Plano de Estudos"}
      >
        {Object.keys(errors).length > 0 && (
          <p style={{ color: "red" }}>*Preencha os campos obrigatórios</p>
        )}

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos">
            <label className="labelCadastroPlanoEstudos">
              Forma de Oferta *
              <select
                name="forma_oferta"
                className={
                  errors.forma_oferta
                    ? "errorSelectCadastroPlanoEstudos"
                    : "selectCadastroPlanoEstudos"
                }
                onChange={handleChange}
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
                name="turno"
                className={
                  errors.turno
                    ? "errorSelectCadastroPlanoEstudos"
                    : "selectCadastroPlanoEstudos"
                }
                onChange={handleChange}
                value={formData.turno}
              >
                <option value="">Selecione o turno</option>
                {Turnos.map((turno, index) => (
                  <option key={index} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
              {errors.turno && (
                <p className="errorMessage">{errors.turno}</p>
              )}
            </label>
          </div>
        </section>

        <section className="sectionCadastroPlanoEstudos">
          <div className="divCadastroPlanoEstudos textarea">
            <label className="labelCadastroPlanoEstudos">
              Parecer Pedagógico *
              <textarea
                name="parecer_pedagogico"
                className={
                  errors.parecer_pedagogico
                    ? "errorTextAreaCadastroPlanoEstudos"
                    : "textAreaCadastroPlanoEstudos"
                }
                onChange={handleChange}
                value={formData.parecer_pedagogico}
              />
              {errors.parecer_pedagogico && (
                <p className="errorMessage">{errors.parecer_pedagogico}</p>
              )}
            </label>
          </div>
        </section>

        <Button tipo="submit" text={state.plano_estudos ? "Salvar Alterações" : "Cadastrar"} />
      </FormContainer>
    </>
  );
};

export default CadastroPlanoEstudos;
