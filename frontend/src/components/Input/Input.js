import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ tipo, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro, nome, dataMinima, lista }) => {
  return (
    <input
      type={tipo}
      value={valor}
      onChange={onChange}
      placeholder={textoAjuda}
      onBlur={onBlur}
      className={erro ? "inputErro" : "input"}
      name={nome}
      disabled={desabilitado}
      style={{textAlign: alinharCentro ? 'center' : 'left'}}
      min={dataMinima}
      list={lista}
    />
  );
};

export default Input;
