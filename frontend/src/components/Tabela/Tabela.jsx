import { useEffect, useState, useRef } from "react";
import Ordenar from "../../assets/ordenar-branco.png";
import Lupa from "../../assets/lupa.png";
import Editar from "../../assets/icone-editar.png";
import styles from "./Tabela.module.css";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const Tabela = ({
  listaFiltrada,
  editar,
  visualizar,
  setPagina,
  proximaURL,
  carregando
}) => {
  const [largura, setLargura] = useState(window.innerWidth);
  const [ordenacao, setOrdenacao] = useState({ coluna: "", ordem: "asc" });
  const [listaOrdenada, setListaOrdenada] = useState([]);
  const [colunas, setColunas] = useState([]);
  const redirect = useNavigate();

  const tableContainerRef = useRef(null);
  const lastItemRef = useRef(null);
  const firstItemRef = useRef(null);

  const setLimiteCaracteres = () => {
    if (largura < 1000) {
      return 15;
    } else {
      return 35;
    }
  };

  const ordenarPorColuna = (coluna) => {
    const novaOrdem =
      ordenacao.coluna === coluna && ordenacao.ordem === "asc" ? "desc" : "asc";

    const lista = [...listaFiltrada].sort((a, b) => {
      let valorA = a[coluna] || "-";
      let valorB = b[coluna] || "-";

      if (valorA === "-" && valorB !== "-") return 1;
      if (valorA !== "-" && valorB === "-") return -1;

      return valorA < valorB
        ? novaOrdem === "asc"
          ? -1
          : 1
        : valorA > valorB
          ? novaOrdem === "asc"
            ? 1
            : -1
          : 0;
    });

    setListaOrdenada(lista);
    setOrdenacao({ coluna, ordem: novaOrdem });
  };

  const formatTituloCabecalho = (titulo) => {
    const format = titulo.split("_");

    const tituloFormat = format.map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    });

    return tituloFormat.join(" ");
  };

  const limitadorDeTexto = (texto, limitador) => {
    if (typeof texto === "string" && texto.length > limitador) {
      return texto.substring(0, limitador) + "...";
    }
    return texto;
  };

  const verificarUltimoItemVisivel = () => {
    if (!tableContainerRef.current || !lastItemRef.current || carregando) return;

    const container = tableContainerRef.current;
    const lastItem = lastItemRef.current;

    const containerBottom = container.scrollTop + container.clientHeight;
    const lastItemTop = lastItem.offsetTop;

    if (containerBottom >= lastItemTop && proximaURL) {
      setPagina((prev) => {
        return prev + 1
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      verificarUltimoItemVisivel();
    };

    if (tableContainerRef.current) {
      tableContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableContainerRef.current) {
        tableContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [carregando]);

  useEffect(() => {
    if (tableContainerRef.current && listaFiltrada.length) {
      lastItemRef.current = tableContainerRef.current.querySelector("tr:last-child");
    }
  }, [listaFiltrada]);

  useEffect(() => {
    if (listaFiltrada.length > 0) {
      const modeloColunas = listaFiltrada.reduce((maior, atual) => {
        return Object.keys(atual).length > Object.keys(maior).length
          ? atual
          : maior;
      }, {});

      setListaOrdenada(listaFiltrada);
      setColunas(Object.keys(modeloColunas));
    }
  }, [listaFiltrada]);

  useEffect(() => {
    const handleResize = () => {
      setLargura(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return listaFiltrada.length ? (
    <div className={styles.containerTabela} ref={tableContainerRef}>
      <table className={styles.tabela}>
        <thead className={styles.cabecalho}>
          <tr className={styles.linhaCabecalho}>
            {colunas.map((coluna, index) =>
              index === 1 && coluna !== "id" ? (
                <th
                  key={index}
                  className={styles.colunaCabecalho}
                  onClick={() => ordenarPorColuna(coluna)}
                >
                  <div className={styles.ordenar}>
                    <img
                      className={styles.iconeAcao}
                      src={Ordenar}
                      alt="Ordenar"
                      title="Ordenar"
                    />
                    {coluna !== "id" ? (
                      <p className={styles.texto}>
                        {formatTituloCabecalho(coluna) || "-"}
                        {ordenacao.coluna === coluna ? (
                          <span
                            className={
                              ordenacao.ordem === "asc"
                                ? "seta-baixo"
                                : "seta-cima"
                            }
                          ></span>
                        ) : (
                          <></>
                        )}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </th>
              ) : coluna !== "id" ? (
                <th
                  key={index}
                  className={styles.colunaCabecalho}
                  onClick={() => ordenarPorColuna(coluna)}
                >
                  <p className={styles.texto}>
                    {formatTituloCabecalho(coluna) || "-"}
                    {ordenacao.coluna === coluna ? (
                      <span
                        className={
                          ordenacao.ordem === "asc" ? "seta-baixo" : "seta-cima"
                        }
                      ></span>
                    ) : (
                      <></>
                    )}
                  </p>
                </th>
              ) : (
                <></>
              )
            )}
            <th className={styles.colunaCabecalho}>Ações</th>
          </tr>
        </thead>
        <tbody className={styles.corpo}>
          {listaOrdenada.map((item, index) => (
            <tr
              key={index}
              className={styles.linhaCorpo}
              ref={index === listaOrdenada.length - 1 ? lastItemRef : undefined}
            >
              {colunas.map((coluna, colIndex) =>
                coluna !== "id" ? (
                  <td key={colIndex} className={styles.colunaCorpo}>
                    {typeof item[coluna] === "string" &&
                      /^\d{4}-\d{2}-\d{2}$/.test(item[coluna])
                      ? item[coluna].split("-").reverse().join("/")
                      : limitadorDeTexto(
                        item[coluna] || "-",
                        setLimiteCaracteres()
                      )}
                  </td>
                ) : (
                  <></>
                )
              )}
              <td className={styles.colunaCorpo}>
                <div className={styles.acoes}>
                  {visualizar && (
                    <img
                      className={styles.icone}
                      src={Lupa}
                      alt="Visualizar"
                      title="Visualizar"
                      onClick={() => redirect(`${item.id}`, { state: item.id })}
                    />
                  )}
                  {editar && (
                    <img
                      className={styles.icone}
                      src={Editar}
                      alt="Editar"
                      onClick={() =>
                        redirect(`${item.id}/editar`, { state: item.id })
                      }
                      title="Editar"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
          {
            carregando ? (
              <tr className="carregando">
                <td colSpan={colunas.length + 1} style={{ textAlign: 'center' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Loading border={'green'} />
                  </div>
                </td>
              </tr>
            ) : (
              <></>
            )
          }
        </tbody>
      </table>
    </div>
  ) : (
    <div className="divTabela">Nenhuma informação para ser exibida</div>
  );
};

export default Tabela;
