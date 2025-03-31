import styles from './Input.module.css'

const Input = ({ tipo, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro, nome, dataMinima, lista, tiposDeArquivo, fonte, id, max, cor }) => {
  return (
    <input
      id={id}
      type={tipo}
      value={valor}
      onChange={onChange}
      placeholder={textoAjuda}
      onBlur={onBlur}
      className={erro ? styles.inputErro : styles.input}
      name={nome}
      disabled={desabilitado}
      style={{
        textAlign: alinharCentro ? 'center' : 'left',
        fontSize: fonte ?? '15px',
      }}
      min={dataMinima}
      maxLength={max}
      list={lista}
      accept={tiposDeArquivo}
    />
  );
};

export default Input;
