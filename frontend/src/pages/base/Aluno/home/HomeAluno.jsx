import { useEffect, useState } from "react";
import styles from "./HomeAluno.module.css";
import { useNavigate } from "react-router-dom";
import { PEDService } from "../../../../services/pedService";
import { PPTService } from "../../../../services/pptService";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import seta from '../../../../assets/chevron-down-svgrepo-com.svg'
import { AxiosError } from "axios";


const statusColors = {
  "Criada": "#9e9e9e",          // cinza
  "Em Andamento": "#345995",  // azul escuro fraco
  "Lançada": "#7ed957",         // verde claro
  "Finalizada": "#006b3f",      // verde do checkbox
  "Desativada": "#8b0000"       // vermelho escuro fraco
};

const HomeAluno = () => {
  const redirect = useNavigate()
  const [dependencias, setDependencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaPED, setPaginaPED] = useState(1)
  const [proxPED, setProxPED] = useState(null)
  const [prevPED, setPrevPED] = useState(null)
  const [paginaPPT, setPaginaPPT] = useState(1)
  const [proxPPT, setProxPPT] = useState(null)
  const [prevPPT, setPrevPPT] = useState(null)
  const [filtros, setFiltros] = useState([])

  const fetchDependencias = async () => {
    try {      
      const res = await Promise.all([
        PEDService.listarAluno('id, curso, disciplina, professor_ped, data_criacao, status, serie_progressao', paginaPED, 'flat', filtros),
        PPTService.listarAluno('id, curso, disciplina, professor_ppt, turma_atual, data_criacao, status', paginaPPT, 'flat', filtros)
      ])

      setDependencias(groupByYear(res[0].data.results, res[1].data.results))

      setProxPED(res[0].data.next ? paginaPED + 1 : null)
      setPrevPED(res[0].data.next ? paginaPED - 1 : null)
      setProxPPT(res[1].data.next ? paginaPPT + 1 : null)
      setPrevPPT(res[1].data.next ? paginaPPT - 1 : null)
    } catch (error) {
      if (error instanceof AxiosError){
          console.error(error.response?.data.message)
      } else{
          console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const groupByYear = (listaPED = [], listaPPT = []) => {
    const todas = [...listaPED, ...listaPPT];

    if (!todas.length) return [];

    const grupos = todas.reduce((acc, item) => {
      const ano = new Date(item.data_criacao).getFullYear();

      if (!acc[ano]) {
        acc[ano] = {
          ano,
          dependencias: []
        };
      }

      acc[ano].dependencias.push(item);
      return acc;
    }, {});

    return Object.values(grupos).sort((a, b) => b.ano - a.ano);
  };

  const toggleFiltro = (valor) => {
    setFiltros((prev) => {
        if (prev.includes(valor)) {
            return prev.filter(item => item !== valor)
        } else {
            return [...prev, valor]
        }
    })
  }

  useEffect(() => {
    fetchDependencias()
  }, [paginaPED, paginaPPT, filtros])

  return (
    <section className={styles.section}>
      <div className={styles.filtros}>
        <input
          id="filtro-desativada"
          type="checkbox"
          value="Desativada"
          checked={filtros.includes("Desativada")}
          onChange={(e) => toggleFiltro(e.target.value)}
          style={{ accentColor: filtros.includes("Desativada") ? "#006b3f" : undefined, cursor: 'pointer' }}
        />
        <label htmlFor="filtro-desativada" style={{ color: "#797979", fontFamily: "Roboto" }}>
            Desativada
        </label>

        <input
          id="filtro-finalizada"
          type="checkbox"
          value="Finalizada"
          checked={filtros.includes("Finalizada")}
          onChange={(e) => toggleFiltro(e.target.value)}
          style={{ accentColor: filtros.includes("Finalizada") ? "#006b3f" : undefined, cursor: 'pointer' }}
        />
        <label htmlFor="filtro-finalizada" style={{ color: "#797979", fontFamily: "Roboto" }}>
            Finalizada
        </label>

        <input
          id="filtro-em-andamento"
          type="checkbox"
          value="Em Andamento"
          checked={filtros.includes("Em Andamento")}
          onChange={(e) => toggleFiltro(e.target.value)}
          style={{ accentColor: filtros.includes("Em Andamento") ? "#006b3f" : undefined, cursor: 'pointer' }}
        />
        <label htmlFor="filtro-em-andamento" style={{ color: "#797979", fontFamily: "Roboto" }}>
            Em Andamento
        </label>

        <input
          id="filtro-criada"
          type="checkbox"
          value="Criada"
          checked={filtros.includes("Criada")}
          onChange={(e) => toggleFiltro(e.target.value)}
          style={{ accentColor: filtros.includes("Criada") ? "#006b3f" : undefined, cursor: 'pointer' }}
        />
        <label htmlFor="filtro-criada" style={{ color: "#797979", fontFamily: "Roboto" }}>
            Criada
        </label>

        <input
          id="filtro-lancada"
          type="checkbox"
          value="Lançada"
          checked={filtros.includes("Lançada")}
          onChange={(e) => toggleFiltro(e.target.value)}
          style={{ accentColor: filtros.includes("Lançada") ? "#006b3f" : undefined, cursor: 'pointer' }}
        />
        <label htmlFor="filtro-lancada" style={{ color: "#797979", fontFamily: "Roboto" }}>
            Lançada
        </label>
      </div>
      <div className={styles.container}>
        {
          prevPED || prevPPT ? (
            <button
              className={styles.button}
              onClick={() => {
                setPaginaPED(paginaPED - 1)
                setPaginaPPT(paginaPPT - 1)
              }}
            >
              <img
                src={seta}
                alt="anterior"
                style={{ width: '20px', height: '20px', rotate: '90deg' }}
              />
            </button>
          ) : null
        }
        <div className={styles.dependenciasContainer}>
          {
            loading ? (
              <CustomLoading/>
            ) : (
              dependencias.map((ano) => (
                <div className={styles.ano}>
                  {ano.ano}
                  {
                    ano.dependencias.map((dependencia) => (
                      <div className={styles.dependencia} onClick={() => redirect(`/session/aluno/${dependencia.turma_atual ? "PPT" : "PED"}/${dependencia.id}/`, {state: {id: dependencia.id, modalidade: !dependencia.turma_atual ? !dependencia.serie_progressao ? "Proeja" : "Integrado" : null }})}>
                        <div className={styles.cabecalho}>
                          <span className={styles.status} style={{backgroundColor: statusColors[dependencia.status]}}>
                            {dependencia.status}
                          </span>
                          <span className={styles.tipo} style={{backgroundColor: dependencia.turma_atual ? "red" : "#345995"}}>
                            {dependencia.turma_atual ? "PPT" : "PED"}
                          </span>
                        </div>
                        <span className={styles.span}>
                          <p className={styles.p}>Professor: </p>
                          {dependencia?.professor_ped?.username ?? dependencia.professor_ppt.username}
                        </span>
                        <span className={styles.span}>
                          <p className={styles.p}>Curso: </p>
                          {dependencia.curso.name}
                        </span>
                        <span className={styles.span}>
                          <p className={styles.p}>Disciplina: </p>
                          {dependencia.disciplina.name}
                        </span>
                        {
                          dependencia.turma_atual ? (
                            <span className={styles.span}>
                              <p className={styles.p}>Turma: </p>
                              {dependencia.turma_atual}
                            </span>
                          ) :  null
                        }
                      </div>
                    ))
                  }
                </div>
              ))
            )
          }
        </div>
        {
          proxPED || proxPPT ? (
            <button
              className={styles.button}
              onClick={() => {
                setPaginaPED(paginaPED + 1)
                setPaginaPPT(paginaPPT + 1)
              }}
            >
              <img
                src={seta}
                alt="anterior"
                style={{ width: '20px', height: '20px', rotate: '-90deg' }}
              />
            </button>
          ) : null
        }
      </div>
    </section>
  )
  
};

export default HomeAluno;
