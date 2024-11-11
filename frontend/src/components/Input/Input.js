import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ type, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro, name, dataMinima, lista }) => {
  return (
    <input
      type={type}
      value={valor}
      onChange={onChange}
      placeholder={textoAjuda}
      onBlur={onBlur}
      className={erro ? "inputErro" : "input"}
      name={name}
      disabled={desabilitado}
      style={{textAlign: alinharCentro ? 'center' : 'left'}}
      min={dataMinima}
      list={lista}
    />
  );
};

export default Input;
