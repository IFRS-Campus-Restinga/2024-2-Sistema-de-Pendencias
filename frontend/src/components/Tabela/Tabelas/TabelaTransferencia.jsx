import styles from '../Tabela.module.css'
import setaDupla from '../../../assets/double-arrow-right-svgrepo-com.svg'
import { useEffect, useRef } from 'react'
import CustomLoading from '../../customLoading/CustomLoading'

const TabelaDeTransferencia = ({
    titulo1,
    titulo2,
    lista1,
    lista2,
    setLista1,
    setLista2,
    obterChave,
    renderizarItem,
    paginaAtualLista1,
    paginaAtualLista2,
    setPaginaAtualLista1,
    setPaginaAtualLista2,
    temProximaPaginaLista1,
    temProximaPaginaLista2,
    temPaginaAnteriorLista1,
    temPaginaAnteriorLista2,
    buscarDadosLista1,
    buscarDadosLista2,
    carregandoLista1,
    carregandoLista2,
}) => {
    const refPrimeiroItemLista1 = useRef(null)
    const refUltimoItemLista1 = useRef(null)
    const refPrimeiroItemLista2 = useRef(null)
    const refUltimoItemLista2 = useRef(null)

    const enviarParaLista2 = (indiceItem) => {
        const item = lista1[indiceItem]

        const novaLista1 = lista1.filter((_, i) => i !== indiceItem)

        const jaExisteNaLista2 = lista2.some(i => obterChave(i) === obterChave(item))
        if (!jaExisteNaLista2) {
            const novaLista2 = [...lista2, item]
            setLista2(novaLista2)
        }

        setLista1(novaLista1)
    }

    const enviarParaLista1 = (indiceItem) => {
        const item = lista2[indiceItem]

        const novaLista2 = lista2.filter((_, i) => i !== indiceItem)

        const jaExisteNaLista1 = lista1.some(i => obterChave(i) === obterChave(item))
        if (!jaExisteNaLista1) {
            const novaLista1 = [...lista1, item]
            setLista1(novaLista1)
        }

        setLista2(novaLista2)
    }

    // Scroll infinito para lista 1
    useEffect(() => {
        if (!refUltimoItemLista1.current) return

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && temProximaPaginaLista1 && !carregandoLista1) {
                    setPaginaAtualLista1(prev => prev + 1)
                }
            })
        }, { threshold: 1.0 })

        observador.observe(refUltimoItemLista1.current)

        return () => observador.disconnect()
    }, [lista1, temProximaPaginaLista1, carregandoLista1])

    useEffect(() => {
        if (paginaAtualLista1 > 1) {
            buscarDadosLista1(paginaAtualLista1)
        }
    }, [paginaAtualLista1])

    // Scroll infinito para lista 2
    useEffect(() => {
        if (!refUltimoItemLista2.current) return

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && temProximaPaginaLista2 && !carregandoLista2 && setPaginaAtualLista2) {
                    setPaginaAtualLista2(prev => prev + 1)
                }
            })
        }, { threshold: 1.0 })

        observador.observe(refUltimoItemLista2.current)

        return () => observador.disconnect()
    }, [lista2, temProximaPaginaLista2, carregandoLista2])

    useEffect(() => {
        if (paginaAtualLista2 > 1 && buscarDadosLista2) {
            buscarDadosLista2(paginaAtualLista2)
        }
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
                                        src={setaDupla}
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
                                        src={setaDupla}
                                        alt="Desvincular"
                                        className={styles.acao}
                                        style={{ rotate: '180deg' }}
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

export default TabelaDeTransferencia
