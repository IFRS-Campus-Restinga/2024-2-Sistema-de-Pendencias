import styles from './LoginPage.module.css'
import ifrs from '../../assets/logo-ifrs-branco.png'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../store/UserContext'
import { useNavigate } from 'react-router-dom'
import CustomLoading from "../../components/customLoading/CustomLoading"

const LoginPage = () => {
  const { user, loading } = useContext(UserContext);
  const redirect = useNavigate();

  useEffect(() => {
    if (!loading && user) {
        redirect(`/session/${user.group}/home`)
    }
  }, [loading, user])

  const handleRedirect = () => {
    window.location.href =
      `${process.env.REACT_APP_HUB_FRONTEND}/session?system=${process.env.REACT_APP_SYSTEM_ID}`;
  };

  if (loading) {
    return <CustomLoading />;
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
  );
};

export default LoginPage