import { useEffect, useState } from "react";
import Ordenar from "../../assets/ordenar-branco.png";
import Lupa from "../../assets/lupa.png";
import Editar from "../../assets/icone-editar.png";
import Deletar from "../../assets/lixeira.png";
import Check from "../../assets/check.png";
import "./Tabela.css";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";

const Tabela = ({
  listaFiltrada,
  showInProgressButton,
  onChangeStatus,
  textButtonInProgress,
  editar,
  deletar,
  visualizar,
}) => {
  const [largura, setLargura] = useState(window.innerWidth);
  const [ordenacao, setOrdenacao] = useState({ coluna: "", ordem: "asc" });
  const [listaOrdenada, setListaOrdenada] = useState([]);
  const [colunas, setColunas] = useState([]);
  const redirect = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [idItem, setIdItem] = useState(null); // Novo estado para armazenar o id do item
  const abrirModal = (id) => {
    console.log(id, "aaa");
    setIdItem(id); // Salva o id do item que acionou o modal
    setModalAberto(true); // Abre o modal
  };
  const fecharModal = () => setModalAberto(false);

  const handleMudarStatus = (id) => {
    console.log("mudar status:", id);
    if (onChangeStatus) {
      onChangeStatus(id); // Chama a função recebida via props
      fecharModal();
    }
  };

  const setLimiteCaracteres = () => {
    if (largura < 1000) {
      return 15; // Limite para telas pequenas
    } else {
      return 35; // Limite para telas grandes
    }
  };

  const ordenarPorColuna = (coluna) => {
    const novaOrdem =
      ordenacao.coluna === coluna && ordenacao.ordem === "asc" ? "desc" : "asc";

    const lista = [...listaFiltrada].sort((a, b) => {
      let valorA = a[coluna] || "-";
      let valorB = b[coluna] || "-";

      // Puxar valores preenchidos ("-") para o fim, independente da ordem
      if (valorA === "-" && valorB !== "-") return 1; // Coloca "-" depois
      if (valorA !== "-" && valorB === "-") return -1; // Coloca preenchidos antes

      // Se ambos são preenchidos ou ambos são vazios ("-"), ordenar normalmente
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
    <div className="divContainerTabela">
      <table className="tabela">
        <thead className="cabecalhoTabela">
          <tr className="linhaCabecalhoTabela">
            {colunas.map((coluna, index) =>
              index === 1 && coluna !== "id" ? (
                <th
                  key={index}
                  className="colunaCabecalhoTabela"
                  onClick={() => ordenarPorColuna(coluna)}
                >
                  <div className="th-ordenar">
                    <img
                      className="icone-ordenar"
                      src={Ordenar}
                      alt="Ordenar"
                      style={{ cursor: "pointer" }}
                      title="Ordenar"
                    />
                    {coluna !== "id" ? (
                      <p className="textoCelula">
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
                  className="colunaCabecalhoTabela"
                  onClick={() => ordenarPorColuna(coluna)}
                >
                  <p className="textoCelula">
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
            <th className="colunaCabecalhoTabela">Ações</th>
          </tr>
        </thead>
        <tbody className="corpoTabela">
          {listaOrdenada.map((item, index) => (
            <tr key={index} className="linhaCorpoTabela">
              {colunas.map((coluna, colIndex) =>
                coluna !== "id" ? (
                  <td key={colIndex} className="colunaCorpoTabela">
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
              <td className="colunaCorpoTabela">
                {}
                <div className="acoes">
                  {visualizar && (
                    <img
                      className="iconeAcoes"
                      src={Lupa}
                      alt="Visualizar"
                      onClick={() => redirect(`${item.id}`, { state: item })}
                      title="Visualizar"
                    />
                  )}
                  {editar && (
                    <>
                      <img
                        className="iconeAcoes"
                        src={Editar}
                        alt="Editar"
                        onClick={() =>
                          redirect(`${item.id}/editar`, { state: item })
                        }
                        title="Visualizar"
                      />
                    </>
                  )}

                  {deletar && (
                    <>
                      <img
                        className="iconeAcoes"
                        src={Deletar}
                        alt="Deletar"
                        onClick={() =>
                          redirect(`${item.id}/deletar`, { state: item })
                        }
                        title="Deletar"
                      />
                    </>
                  )}

                  {showInProgressButton && item.status != "Lançado" && (
                    <img
                      className="iconeAcoes"
                      src={Check}
                      alt="Alterar para 'Lançado'"
                      title="Alterar para 'Lançado'"
                      onClick={() => abrirModal(item)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
          {modalAberto && (
            <Modal
              estaAberto={modalAberto}
              aoFechar={fecharModal}
              mensagem="Alterar o status da PPT para 'Lançado'"
              textoCancelar="Não"
              textoOk="Alterar"
              colorButton={"red"}
              onClick={() => handleMudarStatus(idItem)} // Usando o idItem para mudança de status
            />
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="divTabela">Nenhuma informação para ser exibida</div>
  );
};

export default Tabela;
