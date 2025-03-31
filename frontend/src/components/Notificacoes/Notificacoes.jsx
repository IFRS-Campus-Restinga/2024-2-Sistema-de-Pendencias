import { useEffect, useState } from 'react'
import { notificacaoService } from '../../services/notificacaoService'
import styles from './Notificacoes.module.css'
import PED_EMI from '../../assets/peds-branco.png'
import PED_ProEJA from '../../assets/peds-proeja-branco.png'
import PPT from '../../assets/ppt-branco.png'
import Plano_Estudos from '../../assets/plano-estudos-branco.png'
import Evento from '../../assets/evento-branco.png'
import Atividade from '../../assets/atividade-branco.png'
import { Link } from 'react-router-dom'
import Loading from '../Loading/Loading'

const Notificacoes = () => {
    const [notificacoes, setNotificacoes] = useState([])
    const [carregando, setCarregando] = useState(true)

    const buscar_notificacoes = async () => {
        try {
            const res = await notificacaoService.buscar()

            if (res.status !== 200) throw new Error(res)

            setNotificacoes(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    const trocar_status = async (idNotificacao) => {
        try {
            const res = await notificacaoService.trocar_status(idNotificacao)

            if (res.status !== 201) throw new Error(res)

            buscar_notificacoes()
        } catch (error) {
            console.error(error.message)
        }
    }

    const setIconeNotif = (tipo) => {
        switch (tipo) {
            case 'PED Integrado':
                return PED_EMI
            case 'PED ProEJA':
                return PED_ProEJA
            case 'PPT':
                return PPT
            case 'Plano de Estudos':
                return Plano_Estudos
            case 'Evento':
                return Evento
            case 'Atividade':
                return Atividade
            default:
        }
    }

    useEffect(() => {
        buscar_notificacoes()
    }, [])

    return (
        <div className={styles.containerNotificacao}>
            {
                carregando ? (
                    <div className={styles.container}>
                        <Loading />
                    </div>
                ) : (
                    notificacoes.length > 0 ? (
                        notificacoes.map((notificacao) => (
                            <Link className={styles.link} to={notificacao.url}>
                                <span className={styles.notificacao} onClick={() => trocar_status(notificacao.id)}>
                                    <p>{new Date(notificacao.data).toLocaleDateString('pt-BR')}</p>
                                    <div className="conteudoNotif">
                                        <p className="descricaoNotif">{notificacao.mensagem}</p>
                                        <img src={setIconeNotif(notificacao.tipo)} className="iconeNotif" />
                                    </div>
                                </span>
                            </Link>
                        ))
                    ) : (
                        <div className={styles.container}>
                            <p className={styles.mensagem}>Você não possui notificações</p>
                        </div>
                    )
                )
            }
        </div>
    )
}
export default Notificacoes