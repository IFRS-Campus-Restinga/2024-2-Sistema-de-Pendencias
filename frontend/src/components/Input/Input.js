import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ tipo, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro }) => {
  return (
    <input
      type={tipo}
      value={valor}
      onChange={onChange}
      placeholder={textoAjuda}
      onBlur={onBlur}
      className={erro ? "inputErro" : "input"}
      disabled={desabilitado ? false : true}
      style={{textAlign: alinharCentro ? 'center' : 'left'}}
    />
  );
};

export default Input;
