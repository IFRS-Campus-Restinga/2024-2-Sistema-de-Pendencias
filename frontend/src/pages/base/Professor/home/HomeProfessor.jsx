import styles from './HomeProfessor.module.css'
import ppt from '../../../../assets/classroom-svgrepo-white-com.svg'
import proeja from '../../../../assets/college-graduation-svgrepo-com.svg'
import emi from '../../../../assets/book-2-svgrepo-com.svg'
import atividade from '../../../../assets/activity-svgrepo-com-white.svg'
import {Link} from 'react-router-dom'

const HomeProfessor = () => {
    return (
        <div className={styles.home}>
            <div className={styles.saudacao}>
                <span className={styles.titulo}>Sistema de Progressões</span>
                <hr className={styles.linha}/>
            </div>

            <div className={styles.menu}>
                <Link to={'/session/professor/peds/Integrado'} className={styles.botaoMenu}>
                    <img src={emi} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Minhas Progressões EMI</p>
                </Link>
                <Link to={'/session/professor/peds/ProEJA'} className={styles.botaoMenu}>
                    <img src={proeja} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Minhas Progressões ProEJA</p>
                </Link>
                <Link to={'/session/professor/atividades/Integrado'} className={styles.botaoMenu}>
                    <img src={atividade} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Atividades EMI</p>
                </Link>
                <Link to={'/session/professor/atividades/ProEJA'} className={styles.botaoMenu}>
                    <img src={atividade} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Atividades ProEJA</p>
                </Link>
            </div>
        </div>
    )
}

export default HomeProfessor