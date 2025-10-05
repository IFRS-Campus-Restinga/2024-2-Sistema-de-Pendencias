import { useState } from 'react'
import styles from './Select.module.css'
import arrowDown from '../../assets/chevron-down-svgrepo-com.svg'
import MensagemErro from '../MensagemErro/MensagemErro'

const Select = ({ opcoes, setValor, selecionado, chave, desabilitado, erro }) => {
    const [aberto, setAberto] = useState(false)

    return (
        <div className={styles.container}>
            <span 
                className={desabilitado ? styles.desabilitado : styles.span} onClick={(e) => {
                if (!desabilitado) {
                    e.stopPropagation()
                    setAberto((prev) => !prev)
                }
            }}>
                <p className={styles.p}>
                    {selecionado.length > 0 ? selecionado : 'Selecione uma opção'}
                </p>
                <img className={styles.icone} src={arrowDown} alt="" onClick={(e) => {
                    if (!desabilitado) {
                        e.stopPropagation()
                        setAberto((prev) => !prev)
                    }
                }}/>
            </span>
            {
                aberto ? (
                    <ul className={styles.ul}>
                        {
                            opcoes.length > 0 ? (
                                opcoes.map((opcao) => (
                                    <li 
                                        className={styles.li} 
                                        onClick={() => {
                                            if (!desabilitado) {
                                                setValor(opcao)
                                                setAberto(false)
                                            }
                                        }}
                                    >
                                        {opcao[chave]}
                                    </li>
                                ))
                            ) : null
                        }
                    </ul>
                ) : null
            }
            {
                erro ? (
                    <MensagemErro  mensagem={erro}/>
                ) : null
            }
        </div>
    )
}

export default Select