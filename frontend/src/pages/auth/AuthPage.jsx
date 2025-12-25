import { useContext, useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLoading from "../../components/customLoading/CustomLoading";
import { verificarGrupos } from "../../utils/permissões";
import { UserContext } from "../../store/UserContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthPage = () => {
  const redirect = useNavigate()
  const context = UserContext
  const {user, setUser} = useContext(context)
  const query = useQuery()
  const [autenticado, setAutenticado] = useState('pendente')

  const obterTokens = async () => {
    const user = query.get('user')
    const profilePicture = query.get('profilePicture')

    try {
      const res = await authService.obterTokens(user)

      setUser(res.data);
      
      localStorage.setItem('profilePicture', JSON.stringify(profilePicture))
      redirect(`/session/${res.data.group}/home`)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
      setAutenticado('recusado')
    }
  }

  useEffect(() => {
    obterTokens()
  }, [])

  if (autenticado === 'recusado') {
    return (
      <main className={styles.main}>
        <h2 className={styles.titulo}>Acesso não autorizado</h2>
        <p className={styles.detalhes}>chave inválida</p>
      </main>
    )
  }

  return (
    <>
      <main className={styles.main}>
        <h2 className={styles.titulo}>Validando acesso...</h2>
        <div className={styles.loadingContainer}>
          <CustomLoading />
        </div>
      </main>
    </>
  );
};

export default AuthPage;
