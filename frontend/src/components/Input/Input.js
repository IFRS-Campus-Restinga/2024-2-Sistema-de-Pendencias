import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ tipo, textoAjuda, erro, onChange, onBlur, valor }) => {
  return (
    <input
      type={tipo}
      value={valor}
      onChange={onChange}
      placeholder={textoAjuda}
      onBlur={onBlur}
      className={erro ? "inputErro" : "input"}
    />
  );
};

export default Input;
