import { useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLoading from "../../components/customLoading/CustomLoading";
import { verificarGrupos } from "../../utils/permissões";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthPage = () => {
  const redirect = useNavigate()
  const query = useQuery()
  const [autenticado, setAutenticado] = useState('pendente')

  const obterTokens = async () => {
    const user = query.get('user')
    const profilePicture = query.get('profilePicture')

    try {
      const res = await authService.obterTokens(user)

      if (res.status !== 200) throw new Error()

      const grupo = verificarGrupos(res.data.group)

      res.data.profile_picture = profilePicture
      
      sessionStorage.setItem('user', JSON.stringify(res.data))

      redirect(`/session/${grupo}/home`)
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

export default AuthPage;
