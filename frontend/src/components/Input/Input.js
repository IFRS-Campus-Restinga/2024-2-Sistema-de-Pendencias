import React, { useState } from "react";
import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ tipo, textoAjuda, erro }) => {
  const [valor, setValor] = useState("");

  return (
    <input
      type={tipo}
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder={textoAjuda}
      className={erro ? "inputErro" : "input"}
    />
  );
};

export default Input;
