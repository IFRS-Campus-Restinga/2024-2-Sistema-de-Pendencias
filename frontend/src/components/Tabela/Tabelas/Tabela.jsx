import CustomLoading from '../../customLoading/CustomLoading';
import styles from '../Tabela.module.css'
import search from '../../../assets/search-alt-svgrepo-com.svg';
import editIcon from '../../../assets/edit-3-svgrepo-com.svg'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef  } from 'react';


const Tabela = ({ lista, carregando, proxima, anterior, setPagina, editar, visualizar, propMap }) => {
    const redirect = useNavigate()
    const primeiroRef = useRef(null)
    const ultimoRef = useRef(null)

    const redirectAction = (itemId, action = '') => {
        redirect(`${itemId}/${action}`, {state: itemId})
    }

    const formatarData = (valor) => {
        if (!valor || valor.length == 0) return "-"
        if (typeof valor !== "string") return valor;

        // Regex para pegar datetime ISO – 2025-12-09T00:00:00-03:00
        const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

        if (isoDatetimeRegex.test(valor)) {
            const date = new Date(valor);
            if (!isNaN(date)) {
                return date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            }
        }

        return valor;
    };

    useEffect(() => {
        if (!primeiroRef.current || !ultimoRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === ultimoRef.current && proxima && !carregando) {
                            console.log(proxima)
                            setPagina(proxima)
                        }
                        if (entry.target === primeiroRef.current && anterior && !carregando) {
                            setPagina(anterior)
                        }
                    }
                })
            },{ threshold: 0.5 });

        observer.observe(primeiroRef.current);
        observer.observe(ultimoRef.current);

        return () => {
            observer.disconnect();
        }
    }, [lista, proxima, anterior]);

    return (
        <div className={styles.containerTabela}>
            {
                carregando ? (
                    <div 
                        className={styles.loadingWrapper}
                        style={{backgroundColor: lista.length === 0 ? 'transparent' : 'rgba(0,0,0,0.3)'}}
                    >
                        <CustomLoading color='white' />
                    </div>
                ) : null
            }
            {
                lista.length == 0 ? (
                    !carregando ? (
                        <div className={styles.containerMensagem}>
                            <p className={styles.mensagem}>Não há resultados para serem mostrados</p>
                        </div>
                    ) : null
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
                                                        {formatarData(value)}
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