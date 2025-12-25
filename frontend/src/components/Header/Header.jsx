import { useContext } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo-ifrs-branco.png";
import Dropdown from '../Dropdown/Dropdown'
import { authService } from '../../services/authService'
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from 'react-toastify'
import { UserContext } from "../../store/UserContext";
import userIcon from '../../assets/user-svgrepo-com-white.svg'


const Header = ({homeUrl}) => {
  const redirect = useNavigate()
  const {user, setUser} = useContext(UserContext)

  const handleLogout = async () => {
    try {
        await authService.logout()
    
        localStorage.clear()
        setUser(null)
    
        redirect('/session')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo do Site" className={styles.logo} onClick={() => redirect(homeUrl)}/>
      {
        user ? (
          <div className={styles.menu}>
            <span className={styles.titulo}>
              <h2 className={styles.saudacao}>
                Bem vindo,
              </h2>
              <p className={styles.grupo}>{user.group}</p>
              <p className={styles.nome}>{user.username}</p>
            </span>
            <Dropdown
              img={JSON.parse(localStorage.getItem('profilePicture')) ?? userIcon}
              fontSize={'12px'}
              itens={[
                {
                  name: 'Logout',
                  onClick: handleLogout
                }
              ]}
            />
          </div>
        ) : (
          <></>
        )
      }
    </header>
  );
};

export default Header;
