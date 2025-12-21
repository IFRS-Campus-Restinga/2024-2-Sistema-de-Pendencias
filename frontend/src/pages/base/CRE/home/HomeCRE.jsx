import { useEffect, useRef, useState } from 'react'
import styles from './HomeCRE.module.css'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import { PPTService } from '../../../../services/pptService'
import { toast } from 'react-toastify'
import check from '../../../../assets/check-svgrepo-com.svg'
import Modal from '../../../../components/Modal/Modal'
import Button from '../../../../components/Button/Button'
import CustomLoading from '../../../../components/customLoading/CustomLoading'
import { AxiosError } from 'axios'
import Label from '../../../../components/Label/Label'
import Input from '../../../../components/Input/Input'
import { validarCampoObrigatorio } from '../../../../utils/validacoes'

const propMap = {
    'id': 'id',
    'aluno': 'aluno',
    'professor_disciplina': 'professor disciplina',
    'professor_ppt': 'professor progressão',
    'curso': 'curso',
    'turma_atual': 'turma atual',
    'turma_progressao': 'turma progressão',
    'disciplina': 'disciplina',
    'data_criacao': 'data criação',
    'status': 'status',
    'situacao': 'situação',
    'nota_final': 'nota'
}

const HomeCRE = () => {
    const primeiroRef = useRef(null)
    const ultimoRef = useRef(null)
    const [PPTs, setPPTs] = useState([])
    const [PPTSelecionada, setPPTSelecionada] = useState(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [anterior, setAnterior] = useState(null)
    const [proxima, setProxima] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    const fetchPPTs = async () => {
        try {
            const res = await PPTService.listarCRE(
                `
                id,
                aluno,
                professor_disciplina,
                professor_ppt,
                curso,
                disciplina,
                turma_atual,
                turma_progressao,
                status,
                data_criacao,
                situacao,
                nota_final,
            `,
            pagina,
            'flat',
            )

            setPPTs(res.data.results)
            setProxima(res.data.prox ? pagina + 1 : null)
            setAnterior(res.data.prev ? pagina - 1 : null)
        } catch (error) {
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        } finally {
            setCarregando(false)
        }
    }

    const confirmarCadastro = async () => {
        toast.promise(
            PPTService.trocarStatus(PPTSelecionada.id, PPTSelecionada),
            {
                pending: "Salvando alterações...",
                success: {
                    render({ data }) {
                        return data.data.message;
                    },
                },
                error: {
                    render({ data }) {
                        const response = data?.response?.data;

                        if (response?.errors && Array.isArray(response.errors)) {
                            // dispara um toast para cada erro
                            response.errors.forEach((msg) => toast.error(msg));
                        }

                        return response?.message ?? "Ocorreu um erro ao salvar.";
                    },
                },
            }
        ).then((res) => {
            if (res.status == 200) {
                setModalAberto(false)
                fetchPPTs()
            }
        });
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
    }, [PPTs, proxima, anterior]);

    useEffect(() => {
        fetchPPTs()
    }, [pagina])

    return (
        <FormContainer titulo={"Gerenciar PPTs"} comprimento={"80%"} infoTexto={"Clique no botão de cormação em uma linha da tabela para selecionar uma PPT.\n\nVerifique os dados e confirme que já foi realizado o cadastro no SIGAA"}>
            <div className={styles.containerTabela}>
                {
                    carregando ? (
                        <div className={styles.loadingTable}>
                            <div className={styles.loadingContainer}>
                                <CustomLoading color='white' />
                            </div>
                        </div>
                    ) : PPTs.length == 0 ? (
                        <div className={styles.containerMensagem}>
                            <p className={styles.mensagem}>Não há resultados para serem mostrados</p>
                        </div>
                    ) : (
                        <table className={styles.tabela}>
                            <thead className={styles.cabecalho}>
                                <tr className={styles.linha}>
                                    {
                                        Object.keys(PPTs[0] ?? {}).map((itemKey) => (
                                            itemKey !== 'id' ? (
                                                <th className={styles.th}>{propMap[itemKey]}</th>
                                            ) : null
                                        ))
                                    }
                                    <th className={styles.thAcoes}/>
                                </tr>
                            </thead>
                            <tbody className={styles.corpo}>
                                {
                                    PPTs.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={styles.linha}
                                            ref={
                                                index === 0 ? primeiroRef :
                                                index === PPTs.length - 1 ? ultimoRef :
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
                                                    <img 
                                                        src={check} 
                                                        alt="detalhes" 
                                                        className={styles.acao} 
                                                        onClick={() => {
                                                            setPPTSelecionada({id: item.id, status: item.status === 'Criada' ? 'Em Andamento' : 'Finalizada', nota_final: null})
                                                            setModalAberto(true)
                                                        }} 
                                                    />
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
            {
                modalAberto ? (
                    <Modal
                        setIsOpen={(aberto) => {
                            if (!aberto) {
                                setPPTSelecionada(null)
                                setModalAberto(false);
                            }
                        }}
                    >
                        <section className={styles.modalSection}>
                            <p style={{textAlign: 'center', fontSize: '18px', color: '#767676'}}>
                                Deseja mudar o status dessa progressão para <b>{PPTSelecionada.status}</b>?<br />
                                Essa ação é irreversível.
                            </p>
                            {
                                PPTSelecionada.status === "Finalizada" ? (
                                    <div style={{width: '50%'}}>
                                        <Input
                                            tipo={'number'}
                                            textoAjuda={"Insira a nota final do aluno"}
                                            valor={PPTSelecionada.nota}
                                            onChange={(e) => {
                                                const valor = e.target.value

                                                if (!isNaN(valor)) {
                                                    setPPTSelecionada({...PPTSelecionada, nota_final: valor})
                                                }
                                            }}
                                            onBlur={() => setErro(validarCampoObrigatorio(PPTSelecionada.nota_final))}
                                            erro={erro}
                                            valorMinimo={0}
                                            valorMaximo={10}
                                            alinharCentro={true}
                                        />
                                    </div>
                                ) : null
                            }
                            <div className={styles.containerBotoes}>
                                <Button texto="Confirmar" onClick={() => confirmarCadastro()}/>
                                <Button color="#a02d2dff" texto="Cancelar" onClick={() => setModalAberto(false)}/>
                            </div>
                        </section>
                    </Modal>
                ) : null
            }
        </FormContainer>
    )
}

export default HomeCRE