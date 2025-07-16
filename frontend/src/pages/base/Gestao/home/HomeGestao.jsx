import styles from './HomeGestao.module.css'
import ppt from '../../../../assets/classroom-svgrepo-white-com.svg'
import lock from '../../../../assets/lock-filled-svgrepo-com-white.svg'
import calendar from '../../../../assets/calendar-svgrepo-com-white.svg'
import proeja from '../../../../assets/college-graduation-svgrepo-com.svg'
import emi from '../../../../assets/book-2-svgrepo-com.svg'
import {Link} from 'react-router-dom'

const HomeGestao = () => {
    return (
        <div className={styles.home}>
            <div className={styles.saudacao}>
                <span className={styles.titulo}>Sistema de Progressões</span>
                <hr className={styles.linha}/>
            </div>

            <div className={styles.menu}>
                <Link to={'grupos'} className={styles.botaoMenu}>
                    <img src={lock} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Grupos & Permissões</p>
                </Link>
                <Link to={'ped/ProEJA'} className={styles.botaoMenu}>
                    <img src={proeja} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões ProEJA</p>
                </Link>
                <Link to={'ped/Integrado'} className={styles.botaoMenu}>
                    <img src={emi} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões EMI</p>
                </Link>
                <Link to={'ppt'} className={styles.botaoMenu}>
                    <img src={ppt} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões Parciais</p>
                </Link>
                <Link to={'calendario'} className={styles.botaoMenu}>
                    <img src={calendar} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Calendário</p>
                </Link>
            </div>
        </div>
    )
}

export default HomeGestao