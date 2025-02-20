import "./Input.css"; // Para o CSS que vamos criar

const Input = ({ type, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro, name, dataMinima, lista, tiposDeArquivo, fonte }) => {
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
      style={{textAlign: alinharCentro ? 'center' : 'left', fontSize: fonte ?? '15px'}}
      min={dataMinima}
      list={lista}
      accept={tiposDeArquivo}
    />
  );
};

export default Input;
