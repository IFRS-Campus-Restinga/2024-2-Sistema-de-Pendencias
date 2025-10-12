import styles from "./PlanoEstudosForm.module.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { toast } from "react-toastify";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";

const Turnos = ["Manhã", "Tarde", "Noite", "Integral"];
const FormaOferta = ["Presencial", "EAD", "Híbrido"];

const PlanoEstudosForm = () => {
  const location = useLocation();
  const modalidade = location.pathname.split("/")[4]
  const { state } = location || {}; // Verifica se estamos editando ou criando
  const [errors, setErrors] = useState({});
  const [desabilitado, setDesabilitado] = useState(false)
  const [formData, setFormData] = useState({
    forma_oferta: "",
    turno: "",
    parecer_pedagogico: "",
    ped: state
  });

  
  return (
    <FormContainer >

    </FormContainer>
  )
};

export default PlanoEstudosForm;
