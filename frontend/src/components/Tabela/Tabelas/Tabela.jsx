import CustomLoading from '../../customLoading/CustomLoading';
import styles from '../Tabela.module.css'
import search from '../../../assets/search-alt-svgrepo-com.svg';
import editIcon from '../../../assets/edit-3-svgrepo-com.svg'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef  } from 'react';


const Tabela = ({ fetchDados, lista, carregando, pagina, proxima, anterior, setPagina, editar, visualizar, propMap }) => {
    const redirect = useNavigate()
    const primeiroRef = useRef(null)
    const ultimoRef = useRef(null)

    const redirectAction = (itemId, action = '') => {
        redirect(`${itemId}/${action}`, {state: itemId})
    }

    useEffect(() => {
        if (!primeiroRef.current || !ultimoRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === ultimoRef.current && proxima) {
                            setPagina(proxima)
                        }
                        if (entry.target === primeiroRef.current && anterior) {
                            setPagina(anterior)
                        }
                    }
                })
            },{ threshold: 1.0 });

        observer.observe(primeiroRef.current);
        observer.observe(ultimoRef.current);

        return () => {
            observer.disconnect();
        }
    }, [lista, proxima, anterior]);


    useEffect(() => {
        fetchDados()
    }, [pagina])

    return (
        <div className={styles.containerTabela}>
            {
                carregando ? (
                    <div className={styles.loadingTable}>
                        <div className={styles.loadingContainer}>
                            <CustomLoading color='white' />
                        </div>
                    </div>
                ) : lista.length == 0 ? (
                    <div className={styles.containerMensagem}>
                        <p className={styles.mensagem}>Não há resultados para serem mostrados</p>
                    </div>
                ) : (
                    <table className={styles.tabela}>
                        <thead className={styles.cabecalho}>
                            <tr className={styles.linha}>
                                {
                                    Object.keys(lista[0] ?? {}).map((itemKey) => (
                                        itemKey !== 'id' ? (
                                            <th className={styles.th}>{propMap[itemKey]}</th>
                                        ) : null
                                    ))
                                }
                                {
                                    !editar && !visualizar ? null : (
                                        <th className={styles.th}>
                                            Ações
                                        </th>
                                    ) 
                                }
                            </tr>
                        </thead>
                        <tbody className={styles.corpo}>
                            {
                                lista.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={styles.linha}
                                        ref={
                                            index === 0 ? primeiroRef :
                                            index === lista.length - 1 ? ultimoRef :
                                            null
                                        }
                                    >
                                        {
                                            Object.entries(item).map(([key, value]) => (
                                                key !== 'id' ? (
                                                    <td key={key} className={styles.coluna}>
                                                        {value ?? '-'}
                                                    </td>
                                                ) : null
                                            ))
                                        }
                                        <td className={styles.coluna}>
                                            <div className={styles.acoes}>
                                                {visualizar && (
                                                    <img src={search} alt="detalhes" className={styles.acao} onClick={() => redirectAction(item.id)} />
                                                )}
                                                {editar && (
                                                    <img src={editIcon} alt="editar" className={styles.acao} onClick={() => redirectAction(item.id, 'editar')} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default Tabela