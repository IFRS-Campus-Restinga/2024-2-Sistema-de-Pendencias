import { useEffect, useState } from "react"
import Ordenar from "../../assets/ordenar-branco.png";
import Lupa from "../../assets/lupa.png";
import './Tabela.css'
import { useNavigate } from "react-router-dom";

const Tabela = ({listaFiltrada, fontSize}) => {
    const [ordenacao, setOrdenacao] = useState({coluna: '', ordem: 'asc'})
    const [listaOrdenada, setListaOrdenada] = useState([])
    const [colunas, setColunas] = useState([])
    const redirect = useNavigate()

    const ordenarPorColuna = (coluna) => {
        const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
      
        const lista = [...listaFiltrada].sort((a, b) => {
          let valorA = a[coluna] || '-';  // Valor A ou "-"
          let valorB = b[coluna] || '-';  // Valor B ou "-"
      
          // Puxar valores preenchidos ("-") para o fim, independente da ordem
          if (valorA === '-' && valorB !== '-') return 1;  // Coloca "-" depois
          if (valorA !== '-' && valorB === '-') return -1; // Coloca preenchidos antes
      
          // Se ambos são preenchidos ou ambos são vazios ("-"), ordenar normalmente
          return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
        });
      
        setListaOrdenada(lista);
        setOrdenacao({ coluna, ordem: novaOrdem });
      };

    const formatTituloCabecalho = (titulo) => {
        const format = titulo.split('_')

        const tituloFormat = format.map((str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        })

        return tituloFormat.join(' ')
    }

    const detalhesItem = (state) => {
        redirect(`${state.id}`, {state: { state }})
    }

    useEffect(() => {
        if (listaFiltrada.length > 0) {
            const modeloColunas = listaFiltrada.reduce((maior, atual) => {
                return (Object.keys(atual).length > Object.keys(maior).length) ? atual : maior;
              }, {});

            setListaOrdenada(listaFiltrada);
            setColunas(Object.keys(modeloColunas));
          }
    }, [listaFiltrada])

    return(
        listaFiltrada.length ? (
            <table className="tabela" style={{fontSize: fontSize}}>
                <thead className="cabecalhoTabela">
                    <tr className="linhaCabecalhoTabela">
                        {
                            colunas.map((coluna, index) => (
                                index === 1 && coluna !== 'id' ? (
                                    <th key={index} className="colunaCabecalhoTabela" onClick={() => ordenarPorColuna(coluna)}>
                                        <div className="th-ordenar">
                                            <img
                                                className="icone-ordenar"
                                                src={Ordenar}
                                                alt="Ordenar"
                                                style={{ cursor: 'pointer'}}
                                                title="Ordenar"
                                            />
                                        {
                                            coluna !== 'id' ? (
                                                <p className="textoCelula">
                                                    {formatTituloCabecalho(coluna) || '-'}
                                                    {ordenacao.coluna === coluna ? (<span className={ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}></span>):(<></>)}
                                                </p>
                                            ) : (
                                                <></>
                                            )
                                        }
                                        </div>
                                    </th>
                                ) : (
                                    coluna !== 'id' ? (
                                        <th key={index} className="colunaCabecalhoTabela" onClick={() => ordenarPorColuna(coluna)}>
                                            <p className="textoCelula">
                                                {formatTituloCabecalho(coluna) || '-'}
                                                {ordenacao.coluna === coluna ? (<span className={ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}></span>):(<></>)}
                                            </p>
                                        </th>
                                    ) : (
                                        <></>
                                    )
                                )
                            ))
                        }
                        <th className="colunaCabecalhoTabela">Ações</th>
                    </tr>
                </thead>
                <tbody className="corpoTabela">
                    {
                        listaOrdenada.map((item, index) => (
                            <tr key={index} className="linhaCorpoTabela">
                                {
                                    colunas.map((coluna, colIndex) => (
                                        coluna !== 'id' ? (
                                            <td key={colIndex} className="colunaCorpoTabela">{item[coluna] || '-'}</td>
                                        ) : (<></>)
                                    ))
                                }
                                <td className="colunaCorpoTabela">
                                <img 
                                    className='iconeAcoes'
                                    src={Lupa} 
                                    alt="Visualizar" 
                                    onClick={() => detalhesItem(item)}
                                    title="Visualizar"/>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        ) : (
            <div className="divTabela">
                Nenhuma informação para ser exibida
            </div>
        )
    )
}

export default Tabela