import { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import { authService } from "../../services/authService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CustomLoading from "../../components/customLoading/CustomLoading";
import { jwtDecode } from "jwt-decode";
import { verificarGrupos } from "../../utils/permissões";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoginPage = () => {
  const redirect = useNavigate()
  const query = useQuery()
  const [autenticado, setAutenticado] = useState('pendente')

  const obterTokens = async () => {
    const system = query.get('system')
    const user = query.get('user')
    const profilePicture = query.get('profilePicture')

    try {
      const res = await authService.obterTokens(user, system)

      if (res.status !== 200) throw new Error()

      const grupo = verificarGrupos(res.data.groups)

      res.data.profile_picture = profilePicture
      
      sessionStorage.setItem('user', JSON.stringify(res.data))
      redirect(`/${grupo}`)
    } catch (error) {
      console.error(error)
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

export default LoginPage;
