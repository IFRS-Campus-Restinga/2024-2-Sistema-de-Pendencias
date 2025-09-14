import styles from './LoginPage.module.css'
import ifrs from '../../assets/logo-ifrs-branco.png'

const LoginPage = () => {

    const handleRedirect = () => {
        window.location.href = `${process.env.REACT_APP_BASE_SYSTEM_URL}/session?system=${process.env.REACT_APP_SYSTEM_ID}`
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <img src={ifrs} alt="" className={styles.logo}/>
            </header>
            <section className={styles.section}>
                <h1 className={styles.h1}>Sistema de Progressões</h1>
                <hr className={styles.hr}/>
                <div className={styles.div} onClick={handleRedirect}>
                    Acessar
                    <img src="https://ifrs.edu.br/wp-content/themes/ifrs-portal-theme/favicons/apple-touch-icon.png" alt="ifrs" className={styles.img}/>
                </div>
            </section>
        </main>
    )
}

export default LoginPage