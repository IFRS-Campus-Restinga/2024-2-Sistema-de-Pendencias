import styles from './HomeCoordenador.module.css'
import ppt from '../../../../assets/classroom-svgrepo-white-com.svg'
import proeja from '../../../../assets/college-graduation-svgrepo-com.svg'
import emi from '../../../../assets/book-2-svgrepo-com.svg'
import {Link} from 'react-router-dom'

const HomeCoordenador = () => {
    return (
        <div className={styles.home}>
            <div className={styles.saudacao}>
                <span className={styles.titulo}>Sistema de Progressões</span>
                <hr className={styles.linha}/>
            </div>

            <div className={styles.menu}>
                <Link to={'/session/coord/peds/ProEJA'} className={styles.botaoMenu}>
                    <img src={proeja} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões ProEJA</p>
                </Link>
                <Link to={'/session/coord/peds/Integrado'} className={styles.botaoMenu}>
                    <img src={emi} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões EMI</p>
                </Link>
                <Link to={'/session/coord/ppts'} className={styles.botaoMenu}>
                    <img src={ppt} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões Parciais</p>
                </Link>
            </div>
        </div>
    )
}

export default HomeCoordenador