import styles from './MensagemErro.module.css'

const MensagemErro = ({ mensagem }) => {

    return (
        <p className={styles.mensagemErro}>{mensagem}</p>
    )
}

export default MensagemErro