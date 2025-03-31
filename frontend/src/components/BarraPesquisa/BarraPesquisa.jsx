import Input from '../Input/Input'
import styles from './BarraPesquisa.module.css'
import Lupa from "../../assets/lupa-branca.png";
import X from "../../assets/x-branco.png";

const BarraPesquisa = ({ setFiltro, filtro, fetchDados, setPagina }) => {

    return (
        <div className={styles.barraPesquisa}>
            <Input
                tipo='text'
                valor={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value)
                    setPagina(1)
                }}
                textoAjuda={'Buscar por nome, e-mail, grupo, status...'}
            />
            <div className={styles.containerIcones}>
                <img
                    className={styles.icone}
                    src={Lupa}
                    onClick={fetchDados}
                />
                <img
                    className={styles.icone}
                    src={X}
                    onClick={() => setFiltro('')}
                />
            </div>
        </div>
    )
}

export default BarraPesquisa