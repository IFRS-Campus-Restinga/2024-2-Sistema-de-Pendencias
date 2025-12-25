import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AtividadeService from "../../../../services/atividadeService"
import AvaliacaoService from "../../../../services/avaliacaoService"
import styles from './AvaliacoesPEDProfessor.module.css'
import tableStyles from '../../../../components/Tabela/Tabela.module.css'
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { toast, ToastContainer } from "react-toastify"
import Input from "../../../../components/Input/Input"
import OpcoesBusca from "../../../../components/OpcoesBusca/OpcoesBusca"
import Button from "../../../../components/Button/Button"
import CustomLoading from "../../../../components/customLoading/CustomLoading"
import xIcone from '../../../../assets/close-svgrepo-com.svg'
import { validarDataMinima } from "../../../../utils/validacoes"
import MensagemErro from "../../../../components/MensagemErro/MensagemErro"
import flattenAndClean from "../../../../utils/flatObject"
import { AxiosError } from "axios"


const AvaliacoesPEDProfessor = () => {
    const redirect = useNavigate()
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]
    const {state} = location
    const [atividades, setAtividades] = useState([])
    const [filtro, setFiltro] = useState("")
    const [atividadesPED, setAtividadesPED] = useState([])
    const [carregando, setCaregando] = useState(true)
    const [erros, setErros] = useState([])

    const fetchAtividades = async () => {
        try {
            const res = await AtividadeService.listar(modalidade, 1, filtro, 'id, titulo')
            
            setAtividades(res.data.results)
        } catch (error) {
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        }
    }

    const fetchAvaliacoes = async () => {
        try {
            const res = await AvaliacaoService.listar(state.ped, modalidade, 'id, atividade.id, atividade.titulo, data_entrega, nota, status, ped.id')
            const flatResp = res.data.map((atividade) => flattenAndClean(atividade, "atividade"))

            setAtividadesPED(flatResp)
        } catch (error) {   
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        } finally {
            setCaregando(false)
        }
    }

    const vincularAtividade = (atividade) => {
        const atividadeExistente = atividadesPED.find((a) => a.atividade.id === atividade.id)

        if (!atividadeExistente) {
            setAtividadesPED(
                [
                    ...atividadesPED, 
                    {
                        atividade: {
                            id: atividade.id,
                            titulo: atividade.titulo,
                        },
                        data_entrega: "",
                        nota: "",
                        status: "Não Avaliada",
                        ped: state.ped
                    }
                ]
            )
            setErros([])
        }
    }

    const desvincularAtividade = (avaliacao) => {
        setAtividadesPED(atividadesPED.filter((a) => a.atividade.id !== avaliacao.atividade.id))
        setErros([])
    }

    const validarForm = () => {
        const novosErros = atividadesPED.map(() => ({
            data_entrega: null,
            nota: null,
        }));

        atividadesPED.forEach((atividade, index) => {
            // validar data
            novosErros[index].data_entrega = validarDataMinima(atividade.data_entrega);

            // validar nota
            let erroNota = null;

            if (atividade.nota > 10 || atividade.nota < 0) {
                erroNota = "A nota deve estar entre 0 e 10";
            }

            if (atividade.status === "Avaliada" && (!atividade.nota || atividade.nota.length === 0)) {
                erroNota = "A nota de atividades avaliadas não pode ser removida";
            }

            novosErros[index].nota = erroNota;
        });

        setErros(novosErros);

        const formularioValido = novosErros.every(
            (errObjeto) => Object.values(errObjeto).every((e) => e === null)
        );

        return formularioValido;
    };

    const submit = async (e) => {
        e.preventDefault()

        if (validarForm()) {
            const promise = AvaliacaoService.vincular(state.ped, modalidade, atividadesPED)
        
            toast.promise(promise, 
                {
                    pending: "Salvando plano de atividades...",
                    success: {
                        render({ data }) {
                            return data.data.message
                        },
                    },
                    error: "Erro de validação"
                }
            ).then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setTimeout(() => {
                        redirect(`/session/professor/peds/${modalidade}/${state.ped}/`, {state: state.ped})
                    }, 3000);
                }
            }).catch((err) => {
                if (err instanceof AxiosError) {
                    const errors = err.response?.data?.message;

                    if (Array.isArray(errors)) {
                        errors.forEach((msg) => toast.error(msg));
                    } else {
                        toast.error(errors);
                    }
                }
            })
        }
    }

    useEffect(() => {
        fetchAvaliacoes()
    }, [state])

    useEffect(() => {
        if (filtro !== "") fetchAtividades()
    }, [filtro])

    if (!state) return null

    return (
        <FormContainer titulo={"Plano de Atividades"} textoInfo={"Utilize a barra de pesquisa para buscar uma atividade pré cadastrada para a modalidade desta progressão.\n\nAo ser avaliada, a nota de uma atividade não pode ser removida, apenas alterada.\n\nApós o encerramento de uma progressão, o plano de atividades não pode mais ser alterado."}>
            <ToastContainer autoClose={2000} position="bottom-right" />
            <section className={styles.section}>
                <div className={styles.inputContainer}>
                    <Input
                        valor={filtro}
                        desabilitado={state.status !== 'Em Andamento'}
                        textoAjuda={`Pesquise uma atividade`}
                        onChange={(e) => {
                            setFiltro(e.target.value)
                        }}
                    />
                    {
                        atividades.length > 0 ? (
                            <OpcoesBusca
                                opcoes={atividades}
                                chave={'titulo'}
                                setValor={(opcao) => {
                                    vincularAtividade(opcao)
                                    setAtividades([])
                                    setFiltro("")
                                }}
                                />
                            ) : null
                    }
                </div>
                {
                    carregando ? (
                        <CustomLoading/>
                    ) : atividadesPED.length > 0 ? (
                        <form className={styles.form} onSubmit={submit}>
                            <div className={tableStyles.containerTabela}>
                                <table className={tableStyles.tabela}>
                                    <thead className={tableStyles.cabecalho}>
                                        <tr className={tableStyles.linha}>
                                            <th className={tableStyles.th}>
                                                Atividade
                                            </th>
                                            <th className={tableStyles.th}>
                                                Data Entrega
                                            </th>
                                            <th className={tableStyles.th}>
                                                Status
                                            </th>
                                            <th className={tableStyles.th}>
                                                Nota
                                            </th>
                                            <th className={tableStyles.th}/>
                                        </tr>
                                    </thead>
                                    <tbody className={tableStyles.corpo}>
                                        {
                                            atividadesPED.map((avaliacao, index) => (
                                                <tr className={tableStyles.linha}>
                                                    <td className={tableStyles.coluna}>
                                                        {avaliacao.atividade.titulo}
                                                    </td>
                                                    <td className={tableStyles.coluna}>
                                                        <div className={styles.inputData}>
                                                            <Input
                                                                tipo={'date'}
                                                                valor={avaliacao.data_entrega ? new Date(avaliacao.data_entrega).toISOString().split("T")[0] : ""}
                                                                onChange={(e) => {
                                                                    setAtividadesPED((prev) => {
                                                                        const atividadesPED = [...prev]

                                                                        atividadesPED[index].data_entrega = e.target.value

                                                                        return atividadesPED
                                                                    })
                                                                }}
                                                                valorMinimo={new Date().toISOString().split("T")[0]}
                                                             />
                                                             {erros[index]?.data_entrega ? <MensagemErro mensagem={erros[index].data_entrega}/> : null}
                                                        </div>
                                                    </td>
                                                    <td className={tableStyles.coluna}>
                                                        {avaliacao.status}
                                                    </td>
                                                    <td className={tableStyles.coluna}>
                                                        <div className={styles.inputData}>
                                                            <Input
                                                                tipo={'text'}
                                                                alinharCentro={true}
                                                                valor={avaliacao.nota ?? ""}
                                                                onChange={(e) => {
                                                                    const valor = e.target.value
                                                                        setAtividadesPED(prev => {
                                                                            const atividadesPED = [...prev];
                                                                            if (valor >= 0 && valor <= 10) atividadesPED[index].nota = valor;
                                                                            return atividadesPED;
                                                                        });
                                                                        return;
                                                                }}
                                                                valorMaximo={10}
                                                                valorMinimo={0}
                                                            />
                                                            {erros[index]?.nota ? <MensagemErro mensagem={erros[index].nota}/> : null}
                                                        </div>
                                                    </td>
                                                    <td className={tableStyles.coluna}>
                                                        <img src={xIcone} className={styles.desvincular} onClick={() => desvincularAtividade(avaliacao)}/>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {
                                !["Criada", "Finalizada", "Desativada"].includes(state.status) ? (
                                    <Button tipo={"submit"} texto={"Salvar Plano de Atividades"}/>
                                ) : null
                            }
                        </form>
                    ) : null
                }
            </section>
        </FormContainer>
    )
}

export default AvaliacoesPEDProfessor