import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AvaliacaoService from "../../../../services/avaliacaoService"
import styles from './FormEncerramentoForm.module.css'
import tableStyles from '../../../../components/Tabela/Tabela.module.css'
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { toast, ToastContainer } from "react-toastify"
import Input from "../../../../components/Input/Input"
import Button from "../../../../components/Button/Button"
import CustomLoading from "../../../../components/customLoading/CustomLoading"
import xIcone from '../../../../assets/close-svgrepo-com.svg'
import { validarCampoObrigatorio, validarDataMaxima, validarDatas } from "../../../../utils/validacoes"
import MensagemErro from "../../../../components/MensagemErro/MensagemErro"
import flattenAndClean from "../../../../utils/flatObject"
import { FormEncerramentoService } from "../../../../services/formEncerramentoService"
import Label from '../../../../components/Label/Label'
import PDFPreview from "../../../../components/PDFPreview/PDFPreview"


const FormEncerramentoForm = () => {
    const location = useLocation()
    const modalidade = location.pathname.split('/')[4]
    const redirect = useNavigate()
    const {state} = location
    const [formFile, setFormFile] = useState(null)
    const [carregando, setCaregando] = useState(true)
    const [desabilitado, setDesabilitado] = useState(false)
    const [formData, setFormData] = useState({
        id: '',
        parecer_final: '',
        atividades: [],
        nota: '',
        ped: state.ped
    })
    const [erros, setErros] = useState({
        parecer_final: null,
        atividades: [],
        nota: null
    })

    const fetchAvaliacoes = async () => {
        try {
            const res = await AvaliacaoService.listar(state.ped, modalidade, 'id, atividade.id, atividade.titulo, data_criacao, data_entrega, nota, status, ped.id')
            const flatResp = res.data.map((atividade) => flattenAndClean(atividade, "atividade"))

            setFormData({...formData, atividades: flatResp})
            setErros({
                ...erros,
                atividades: flatResp.map(() => ({
                    data_criacao: null,
                    data_entrega: null,
                    atividade: { titulo: null }
                }))
            });
        } catch (error) {   
            console.error(error)
        } finally {
            setCaregando(false)
        }
    }

    const fetchForm = async () => {
        try {
            const res = await FormEncerramentoService.buscar(state.form_encerramento, modalidade, 'parecer_final')
    
            setFormData({
                ...formData,
                atividades: res.data.atividades,
                parecer_final: res.data.parecer_final,
                nota: res.data.nota,
            })
    
            setFormFile(res.data.form)
        } catch (error) {
            console.error(error)
        } finally {
            setCaregando(false)
        }
    }

    const validarForm = () => {
        let novosErros = {
            parecer_final: null,
            atividades: [],
            nota: null
        }

        for (let campo in formData) {
            switch (campo) {
                case 'parecer_final':
                    novosErros.parecer_final = validarCampoObrigatorio(formData.parecer_final)
                    break;
                case 'nota':
                    novosErros.nota = isNaN(formData.nota) ? "Campo inválido" : null
                    break
                case 'atividades':
                    formData.atividades.map((a, index) => {
                        let tituloErro = validarCampoObrigatorio(a.atividade.titulo)
                        let dataEntregaErro = validarCampoObrigatorio(a.data_entrega) ?? validarDatas(a.data_criacao, a.data_entrega)
                        let dataCriacaoErro = validarCampoObrigatorio(a.data_criacao)

                        if (tituloErro || dataCriacaoErro || dataEntregaErro) {
                            novosErros.atividades[index] = {
                                atividade: {
                                    titulo: tituloErro
                                },
                                data_criacao: dataCriacaoErro,
                                data_entrega: dataEntregaErro
                            }
                        } else {
                            novosErros.atividades[index] = null
                        }
                    })
                default:
                    break;
            }
        }

        setErros(novosErros);

        return Object.values(novosErros).every(erro =>
            erro === null ||
            (Array.isArray(erro) && erro.every(e => e === null))
        );    
    };

    const submit = async (e) => {
        e.preventDefault()

        if (validarForm()) {
            const promise = state.form_encerramento ?
            FormEncerramentoService.editar(state.form_encerramento, modalidade, formData) :
            FormEncerramentoService.criar(state.ped, modalidade, formData)
        
            toast.promise(promise, 
                {
                    pending: "Salvando formulário de encerramento...",
                    success: {
                        render({ data }) {
                            return data.data.mensagem
                        },
                    },
                    error: {
                        render({ data }) {
                        const response = data?.response?.data
                        if (response?.errors && Array.isArray(response.errors)) {
                            response.errors.forEach(msg => toast.error(msg))
                        }
                        return response?.mensagem ?? "Ocorreu um erro ao registrar."
                        },
                    },
                }
            )

            try {
                const res = await promise
                setFormFile(res.data.form)
                redirect(`/session/professor/peds/${modalidade}/$${state.ped}/`, {state: state.ped})
            } catch (err) {
                console.error("Erro ao registrar formulário:", err)
                setDesabilitado(false)
            }
        }
    }

    const removerAtividade = (avaliacao) => {

    }

    const addAvaliacao = () => {
        const nova = {
            atividade: { titulo: "" },
            data_criacao: "",
            data_entrega: ""
        }

        setFormData(prev => ({
            ...prev,
            atividades: [...prev.atividades, nova]
        }));
    }

    useEffect(() => {
        if (state) {
            if (state.form_encerramento) {
                fetchForm()
            } else {
                fetchAvaliacoes()
            }
        }
    }, [state])

    if (!state) return null

    return (
        <FormContainer titulo={"Formulário de Encerramento"} textoInfo={"Preencha os campos obrigatórios (*)\n\nUtilize o botão '+' abaixo da tabela para adicionar atividades, preenchendo a data de criação, nome da atividade e respectiva data de entrega.\n\nCaso editado, a lista de atividades enviada, sobrescreverá a atual."}>
            <ToastContainer/>
                {
                    carregando ? (
                        <CustomLoading/>
                    ) : (
                        <form className={styles.form} onSubmit={submit}>
                            {
                                formFile ? (
                                <div className={styles.pdfContainer}>
                                    <PDFPreview
                                        pdfData={formFile}
                                        width={'120px'}
                                        height={'150px'}
                                    />
                                    <p className={styles.p}>Clique para visualizar o PDF gerado</p>
                                </div>
                                ) : null
                            }
                            <section className={styles.section}>
                                <div className={styles.formGroup}>
                                    <Label titulo={"Parecer final *"}>
                                        <textarea 
                                            className={styles.textArea}
                                            value={formData.parecer_final}
                                            onChange={(e) => setFormData({...formData, parecer_final: e.target.value})}
                                            maxLength={500}
                                        />
                                        {erros.parecer_final ? <MensagemErro mensagem={erros.parecer_final}/> : null}
                                    </Label>
                                </div>
                                <div className={styles.formGroup}>
                                    <div className={tableStyles.containerTabela}>
                                        <table className={tableStyles.tabela}>
                                            <thead className={tableStyles.cabecalho}>
                                                <tr className={tableStyles.linha}>
                                                    <th className={tableStyles.th}>
                                                        Data
                                                    </th>
                                                    <th className={tableStyles.th}>
                                                        Atividade
                                                    </th>
                                                    <th className={tableStyles.th}>
                                                        Data de entrega
                                                    </th>
                                                    <th className={tableStyles.th}/>
                                                </tr>
                                            </thead>
                                            <tbody className={tableStyles.corpo}>
                                                {
                                                    formData.atividades.map((avaliacao, index) => (
                                                        <tr className={tableStyles.linha}>
                                                            <td className={tableStyles.coluna}>
                                                                <Input
                                                                    tipo={"date"}
                                                                    desabilitado={avaliacao.id ? true : false}
                                                                    valor={new Date(avaliacao.data_criacao).toISOString().split("T")[0]}
                                                                    onChange={(e) => {
                                                                        setFormData((prev) => {
                                                                            let form = {...prev}

                                                                            form.atividades[index].data_criacao = e.target.value

                                                                            return form
                                                                        })
                                                                    }}
                                                                    onBlur={() => {
                                                                        setErros(prev => {
                                                                            let err = {...prev};

                                                                            if (!err.atividades[index]) {
                                                                                err.atividades[index] = {
                                                                                    data_criacao: null,
                                                                                    data_entrega: null,
                                                                                    atividade: { titulo: null }
                                                                                };
                                                                            }

                                                                            err.atividades[index].data_criacao =
                                                                                validarDataMaxima(formData.atividades[index].data_criacao);

                                                                            return err;
                                                                        });
                                                                    }}
                                                                    erro={erros.atividades[index]?.data_criacao}
                                                                    valorMaximo={new Date().toISOString().split("T")[0]}
                                                                />
                                                            </td>
                                                            <td className={tableStyles.coluna}>
                                                                <div className={styles.inputData}>
                                                                    <Input
                                                                        tipo={'text'}
                                                                        alinharCentro={true}
                                                                        valor={avaliacao.atividade.titulo ?? ""}
                                                                        desabilitado={avaliacao.id ? true : false}
                                                                        onChange={(e) => {
                                                                        setFormData((prev) => {
                                                                            let form = {...prev}

                                                                            form.atividades[index].atividade.titulo = e.target.value

                                                                            return form
                                                                        })
                                                                    }}
                                                                    onBlur={() => {
                                                                        setErros(prev => {
                                                                            let err = {...prev};

                                                                            if (!err.atividades[index]) {
                                                                                err.atividades[index] = {
                                                                                    data_criacao: null,
                                                                                    data_entrega: null,
                                                                                    atividade: { titulo: null }
                                                                                };
                                                                            }

                                                                            err.atividades[index].atividade.titulo =
                                                                                validarCampoObrigatorio(formData.atividades[index].atividade.titulo);

                                                                            return err;
                                                                        });
                                                                    }}
                                                                    erro={erros.atividades[index]?.atividade.titulo}
                                                                />
                                                                </div>
                                                            </td>
                                                            <td className={tableStyles.coluna}>
                                                                <div className={styles.inputData}>
                                                                    <Input
                                                                        tipo={"date"}
                                                                        desabilitado={avaliacao.id ? true : false}
                                                                        valor={new Date(avaliacao.data_entrega).toISOString().split("T")[0]}
                                                                        onChange={(e) => {
                                                                            setFormData((prev) => {
                                                                                const form = {...prev}

                                                                                form.atividades[index].data_entrega = e.target.value

                                                                                return form
                                                                            })
                                                                        }}
                                                                        onBlur={() => {
                                                                            setErros(prev => {
                                                                                let err = {...prev};

                                                                                if (!err.atividades[index]) {
                                                                                    err.atividades[index] = {
                                                                                        data_criacao: null,
                                                                                        data_entrega: null,
                                                                                        atividade: { titulo: null }
                                                                                    };
                                                                                }

                                                                                err.atividades[index].data_entrega =
                                                                                    validarDataMaxima(formData.atividades[index].data_entrega);

                                                                                return err;
                                                                            });
                                                                        }}
                                                                        erro={erros.atividades[index]?.data_entrega}
                                                                        valorMaximo={new Date().toISOString().split("T")[0]}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className={tableStyles.coluna}>
                                                                {
                                                                    !avaliacao.id ? (
                                                                        <img src={xIcone} className={styles.remover} onClick={() => removerAtividade(avaliacao)}/>
                                                                    ) : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className={styles.addButton} type="button" onClick={() => addAvaliacao()}>
                                        +        
                                    </button>
                                </div>
                                <div className={styles.formGroup}>
                                    <Label titulo={"Nota final *"}>
                                        <Input
                                            tipo={'text'}
                                            alinharCentro={true}
                                            valor={formData.nota ?? ""}
                                            onChange={(e) => {
                                                const valor = e.target.value
                                                    setFormData(prev => {
                                                        const form = {...prev};
                                                        if (valor >= 0 && valor <= 10) form.nota = valor;
                                                        return form;
                                                    });
                                                    return;
                                            }}
                                            onBlur={() => setErros({...erros, nota: validarCampoObrigatorio(formData.nota)})}
                                            valorMaximo={10}
                                            valorMinimo={0}
                                            erro={erros.nota}
                                        />
                                        {erros.nota ? <MensagemErro mensagem={erros.nota}/> : null}
                                    </Label>
                                </div>
                                {
                                    !["Criada", "Finalizada", "Desativada"].includes(state.status) ? (
                                        <Button disabled={desabilitado} tipo={"submit"} texto={"Salvar Formulário de Encerramento"}/>
                                    ) : null
                                }
                            </section>
                        </form>
                    )
                }
        </FormContainer>
    )
}

export default FormEncerramentoForm