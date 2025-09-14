import styles from './OpcoesBusca.module.css'


const OpcoesBusca = ({ opcoes, setValor, mensagemErro, chave }) => {

    return (
        <div className={styles.listaOpcoesContainer}>
            <ul className={styles.listaOpcoes}>
                {
                    opcoes?.length > 0 ? (
                        opcoes.map((opcao) => (
                            <li className={styles.opcao} onClick={() => setValor(opcao)}>
                                {opcao[chave]}
                            </li>
                        ))
                    ) : (
                        <li>{mensagemErro}</li>
                    )
                }
            </ul>
        </div>
    )
}

export default OpcoesBusca