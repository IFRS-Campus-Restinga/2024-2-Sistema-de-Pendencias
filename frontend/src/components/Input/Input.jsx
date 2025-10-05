import MensagemErro from '../MensagemErro/MensagemErro';
import styles from './Input.module.css'

const Input = ({ tipo, textoAjuda, erro, onChange, onBlur, valor, desabilitado, alinharCentro, nome, dataMinima, lista, tiposDeArquivo, fonte, id, max, cor, dataMaxima }) => {
  return (
    <>
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
        max={dataMaxima}
        list={lista}
        accept={tiposDeArquivo}
      />
      {
        erro ? (
          <MensagemErro mensagem={erro}/>
        ) : null
      }
    </>
  );
};

export default Input;
