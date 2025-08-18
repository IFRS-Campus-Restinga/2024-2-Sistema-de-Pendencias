import styles from '../Tabela.module.css'
import doubleArrow from '../../../assets/double-arrow-right-svgrepo-com.svg'
import { useEffect, useRef } from 'react'
import CustomLoading from '../../customLoading/CustomLoading'

const TabelaTransferenciaDupla = ({
    titulo1,
    titulo2,
    lista1,
    lista2,
    setLista1,
    setLista2,
    callbackLista1,
    callbackLista2,
    obterChave,
    renderizarItem,
    paginaAtualLista1,
    paginaAtualLista2,
    setPaginaAtualLista1,
    setPaginaAtualLista2,
    proximaPaginaLista1,
    proximaPaginaLista2,
    buscarDadosLista1,
    buscarDadosLista2,
    carregandoLista1,
    carregandoLista2,
}) => {
    const refPrimeiroItemLista1 = useRef(null)
    const refUltimoItemLista1 = useRef(null)
    const refPrimeiroItemLista2 = useRef(null)
    const refUltimoItemLista2 = useRef(null)

    const enviarParaLista2 = (indice) => {
        const item = lista1[indice]
        const lista1Atualizada = lista1.filter((_, i) => i !== indice)

        const jaNaLista2 = lista2.some((i) => obterChave(i) === obterChave(item))
        if (!jaNaLista2) {
            const lista2Atualizada = [...lista2, item]
            setLista2(lista2Atualizada)
        }

        setLista1(lista1Atualizada)
        if (callbackLista1) callbackLista1(item)
    }

    const enviarParaLista1 = (indice) => {
        const item = lista2[indice]
        const lista2Atualizada = lista2.filter((_, i) => i !== indice)

        const jaNaLista1 = lista1.some((i) => obterChave(i) === obterChave(item))
        if (!jaNaLista1) {
            const lista1Atualizada = [...lista1, item]
            setLista1(lista1Atualizada)
        }

        setLista2(lista2Atualizada)
        if (callbackLista2) callbackLista2(item)
    }

    // Scroll infinito lista 1
    useEffect(() => {
        if (!refUltimoItemLista1.current) return

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting && proximaPaginaLista1 && !carregandoLista1) {
                    setPaginaAtualLista1(prev => prev + 1)
                }
            })
        }, { threshold: 1.0 })

        observador.observe(refUltimoItemLista1.current)

        return () => observador.disconnect()
    }, [lista1, proximaPaginaLista1, carregandoLista1])

    useEffect(() => {
        if (paginaAtualLista1 && paginaAtualLista1 > 1) buscarDadosLista1(paginaAtualLista1)
    }, [paginaAtualLista1])

    // Scroll infinito lista 2
    useEffect(() => {
        if (!refUltimoItemLista2.current) return

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting && proximaPaginaLista2 && !carregandoLista2 && setPaginaAtualLista2) {
                    setPaginaAtualLista2(prev => prev + 1)
                }
            })
        }, { threshold: 1.0 })

        observador.observe(refUltimoItemLista2.current)

        return () => observador.disconnect()
    }, [lista2, proximaPaginaLista2, carregandoLista2])

    useEffect(() => {
        if (paginaAtualLista2 && paginaAtualLista2 > 1) buscarDadosLista2(paginaAtualLista2)
    }, [paginaAtualLista2])

    return (
        <section className={styles.containerTabelas}>
            <div className={styles.containerTabelaDupla}>
                {carregandoLista1 && (
                    <div className={styles.janelaCarregamento}>
                        <CustomLoading />
                    </div>
                )}
                <table className={styles.tabela}>
                    <thead className={styles.cabecalho}>
                        <tr className={styles.linha}>
                            <th className={styles.th}>{titulo1}</th>
                            <th className={styles.thAction} />
                        </tr>
                    </thead>
                    <tbody className={styles.corpo}>
                        {lista1.map((item, indice) => (
                            <tr
                                key={`lista1-${obterChave(item)}`}
                                className={styles.linha}
                                ref={
                                    indice === 0
                                        ? refPrimeiroItemLista1
                                        : indice === lista1.length - 1
                                        ? refUltimoItemLista1
                                        : null
                                }
                            >
                                <td className={styles.coluna}>{renderizarItem(item)}</td>
                                <td className={styles.tdAction}>
                                    <img
                                        src={doubleArrow}
                                        alt="Vincular"
                                        className={styles.acao}
                                        onClick={() => enviarParaLista2(indice)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.containerTabelaDupla}>
                {carregandoLista2 && (
                    <div className={styles.janelaCarregamento}>
                        <CustomLoading />
                    </div>
                )}
                <table className={styles.tabela}>
                    <thead className={styles.cabecalho}>
                        <tr className={styles.linha}>
                            <th className={styles.thAction} />
                            <th className={styles.th}>{titulo2}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.corpo}>
                        {lista2.map((item, indice) => (
                            <tr
                                key={`lista2-${obterChave(item)}`}
                                className={styles.linha}
                                ref={
                                    indice === 0
                                        ? refPrimeiroItemLista2
                                        : indice === lista2.length - 1
                                        ? refUltimoItemLista2
                                        : null
                                }
                            >
                                <td className={styles.tdAction}>
                                    <img
                                        src={doubleArrow}
                                        alt="Desvincular"
                                        style={{ rotate: '180deg' }}
                                        className={styles.acao}
                                        onClick={() => enviarParaLista1(indice)}
                                    />
                                </td>
                                <td className={styles.coluna}>{renderizarItem(item)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default TabelaTransferenciaDupla
