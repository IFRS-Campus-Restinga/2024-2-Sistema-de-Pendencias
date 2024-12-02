import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./planoEstudos.css";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import { validarFormularioPlanoEstudos } from "./validacoes";

const Turnos = ["Manhã", "Tarde", "Noite", "Integral"];
const FormaOferta = ["Presencial", "EAD", "Híbrido"];

const PlanoEstudos = () => {
  const { pedId } = useParams(); // ID do plano de estudos
  const location = useLocation();
  const { state } = location || {}; // Verifica se estamos editando ou criando

  const [formData, setFormData] = useState({
    forma_oferta: "",
    turno: "",
    parecer_pedagogico: "",
    pedId: pedId || "",
  });

  const [errors, setErrors] = useState({});

  // Busca os dados do plano de estudos caso esteja editando
  useEffect(() => {
    const fetchPlanoEstudo = async () => {
      if (state?.isEditing && pedId) {
        try {
          const response = await PlanoEstudosService.buscarPlanoEstudo(pedId);
          setFormData({
            forma_oferta: response.forma_oferta || "",
            turno: response.turno || "",
            parecer_pedagogico: response.parecer_pedagogico || "",
            pedId: pedId,
          });
        } catch (error) {
          console.error("Erro ao buscar detalhes do plano de estudos", error);
        }
      }
    };

    fetchPlanoEstudo();
  }, [state, pedId]);

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
        if (state?.isEditing) {
          response = await PlanoEstudosService.update(pedId, formData);
        } else {
          response = await PlanoEstudosService.create(formData);
        }

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(response.response.data.mensagem);
        }

        // Exibe toast de sucesso
        toast.success(
          state?.isEditing
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
          pedId: "",
        });
        setErrors({}); // Limpa os erros
      } catch (error) {
        console.error(
          state?.isEditing
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

  return (
    <>
      <ToastContainer />
      <FormContainer
        onSubmit={handleSubmit}
        titulo={state?.isEditing ? "Editar Plano de Estudos" : "Cadastrar Plano de Estudos"}
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

        <Button tipo="submit" text={state?.isEditing ? "Salvar Alterações" : "Cadastrar"} />
      </FormContainer>
    </>
  );
};

export default PlanoEstudos;
