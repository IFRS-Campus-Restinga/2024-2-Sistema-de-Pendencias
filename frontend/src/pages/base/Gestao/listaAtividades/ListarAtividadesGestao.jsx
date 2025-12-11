import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AvaliacaoService from "../../../../services/avaliacaoService"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import styles from '../../../../components/Tabela/Tabela.module.css'
import lupa from '../../../../assets/search-alt-svgrepo-com.svg'
import CustomLoading from "../../../../components/customLoading/CustomLoading"


const ListarAtividadesGestao = () => {
    const location = useLocation()
    const redirect = useNavigate()
    const { state } = location
    const [avaliacoes, setAvaliacoes] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAvaliacoes = async () => {
        try {
            const res = await AvaliacaoService.listar(state.ped, state.modalidade, 'id, atividade.titulo, atividade.id, data_criacao, data_entrega, status, nota')
            setAvaliacoes(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAvaliacoes()
    }, [])

    return (
        <FormContainer titulo={"Atividades da PED"}>
            <section style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                {
                    avaliacoes.length == 0 ? (
                        <div className={styles.containerMensagem}>
                            <p className={styles.mensagem}>Não há resultados para serem mostrados</p>
                        </div>
                    ) : (
                        <div className={styles.containerTabela}>
                            <table className={styles.tabela}>
                                <thead className={styles.cabecalho}>
                                    <tr className={styles.linha}>
                                        <th className={styles.th}>Atividade</th>
                                        <th className={styles.th}>Data Criação</th>
                                        <th className={styles.th}>Data Entrega</th>
                                        <th className={styles.th}>Status</th>
                                        <th className={styles.th}>Nota</th>
                                        <th className={styles.thAction}/>
                                    </tr>
                                </thead>
                                <tbody className={styles.corpo}>

                                    {
                                        loading ? (
                                            <CustomLoading/>
                                        ) : (
                                            avaliacoes.map((avaliacao) => (
                                                <tr className={styles.linha}>
                                                    <td className={styles.coluna}>{avaliacao.atividade.titulo}</td>
                                                    <td className={styles.coluna}>{new Date(avaliacao.data_criacao).toLocaleDateString("pt-BR")}</td>
                                                    <td className={styles.coluna}>{new Date(avaliacao.data_entrega).toLocaleDateString("pt-BR")}</td>
                                                    <td className={styles.coluna}>{avaliacao.status}</td>
                                                    <td className={styles.coluna}>{avaliacao.nota}</td>
                                                    <td className={styles.tdAction}>
                                                        <img src={lupa} alt="detalhes" className={styles.acao} onClick={() => redirect(`${avaliacao.atividade.id}`, {state: {id: avaliacao.atividade.id, modalidade: state.modalidade}})}/>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                }
            </section>
        </FormContainer>
    )
}

export default ListarAtividadesGestao