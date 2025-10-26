import styles from './HomeGestao.module.css'
import ppt from '../../../../assets/classroom-svgrepo-white-com.svg'
import lock from '../../../../assets/lock-filled-svgrepo-com-white.svg'
import calendar from '../../../../assets/calendar-svgrepo-com-white.svg'
import proeja from '../../../../assets/college-graduation-svgrepo-com.svg'
import emi from '../../../../assets/book-2-svgrepo-com.svg'
import aluno from '../../../../assets/user-graduate-svgrepo-com-white.svg'
import servidor from '../../../../assets/user-suit-svgrepo-com-white.svg'
import {Link} from 'react-router-dom'

const HomeGestao = () => {
    return (
        <div className={styles.home}>
            <div className={styles.saudacao}>
                <span className={styles.titulo}>Sistema de Progressões</span>
                <hr className={styles.linha}/>
            </div>

            <div className={styles.menu}>
                <Link to={'/session/gestao_escolar/grupos'} className={styles.botaoMenu}>
                    <img src={lock} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Grupos & Permissões</p>
                </Link>
                <Link to={'/session/gestao_escolar/servidores'} className={styles.botaoMenu}>
                    <img src={servidor} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Servidores</p>
                </Link>
                <Link to={'/session/gestao_escolar/alunos'} className={styles.botaoMenu}>
                    <img src={aluno} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Alunos</p>
                </Link>
                <Link to={'/session/gestao_escolar/peds/ProEJA'} className={styles.botaoMenu}>
                    <img src={proeja} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões ProEJA</p>
                </Link>
                <Link to={'/session/gestao_escolar/peds/Integrado'} className={styles.botaoMenu}>
                    <img src={emi} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões EMI</p>
                </Link>
                <Link to={'/session/gestao_escolar/ppts'} className={styles.botaoMenu}>
                    <img src={ppt} alt="" className={styles.iconeBotao} />
                    <p className={styles.textoBotao}>Gerenciar Progressões Parciais</p>
                </Link>
            </div>
        </div>
    )
}

export default HomeGestao