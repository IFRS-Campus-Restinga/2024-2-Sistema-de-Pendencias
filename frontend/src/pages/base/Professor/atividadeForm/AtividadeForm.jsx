import FormContainer from '../../../../components/FormContainer/FormContainer'
import { ToastContainer, toast } from 'react-toastify'
import styles from './AtividadeForm.module.css'
import Input from '../../../../components/Input/Input'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../../../../components/Button/Button'
import Switch from '../../../../components/Switch/Switch'
import uploadCinza from '../../../../assets/upload-svgrepo-com.svg'
import uploadBranco from '../../../../assets/upload-svgrepo-com-white.svg'
import lock from '../../../../assets/lock-filled-svgrepo-com.svg'
import PDFPreview from '../../../../components/PDFPreview/PDFPreview'
import Label from '../../../../components/Label/Label'
import CustomLoading from '../../../../components/customLoading/CustomLoading'
import { validarCampoObrigatorio } from '../../../../utils/validacoes'
import MensagemErro from '../../../../components/MensagemErro/MensagemErro'
import AtividadeService from '../../../../services/atividadeService'

const AtividadeForm = () => {
    const location = useLocation()
    const { state } = location
    const [modalidade, setModalidade] = useState(state?.modalidade ?? 'Integrado')
    const [isLoading, setIsLoading] = useState(true)
    const [desabilitado, setDesabilitado] = useState(false)
    const [erros, setErros] = useState(null)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        arquivo: '',
    })

    const trocarModalidade = () => {
        if (!state) {
            setModalidade(modalidade === 'Integrado' ? 'ProEJA' : 'Integrado')
        }
    }

    const validarForm = () => {
        let novosErros = {
            titulo: null,
            descricao: null,
        }

        for (let campo in formData) {
            switch (campo) {
                case 'titulo':
                    novosErros.titulo = validarCampoObrigatorio(formData.titulo)
                    break;
                case 'descricao':
                    novosErros.descricao = validarCampoObrigatorio(formData.descricao)
                    break;
                default:
                    break;
            }
        }

        setErros(novosErros)
        return Object.values(erros).every((erro) => erro === null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDesabilitado(true)
        
        if (validarForm()) {
            const promise = state 
            ? AtividadeService.editar(state, modalidade, formData)
            : AtividadeService.criar(modalidade, formData)
        
            toast.promise(promise, 
                {
                    pending: "Registrando Atividade...",
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
                

            } catch (err) {
                console.error("Erro ao registrar atividade:", err)
                setDesabilitado(false)
            }
        } else {
            setDesabilitado(false)
        }
    }

    const limitadorDeTexto = (texto, limitador) => {
        if (typeof texto === "string" && texto.length > limitador) {
          return texto.substring(0, limitador) + "...";
        }
        return texto;
    }

    const fetchAtividade = async () => {
        try {
            const res = await AtividadeService.porId(state, modalidade, 'id, titulo, descricao, arquivo')

            if (res.status !== 200) throw new Error(res)

            setFormData(res.data)
            
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        if (state) {
            fetchAtividade()
        } else {
            setIsLoading(false)
        }
    }, []);

    if (isLoading) return <CustomLoading/>

    return (
        <FormContainer 
            titulo={state ? 'Editar Atividade' : 'Cadastrar Atividade'} 
            comprimento={'60%'}
            textoInfo={"Preencha os campos obrigatórios (*)\n\nCaso desejar, faça o upload de um arquivo (png, jpeg, pdf) para auxiliar o aluno na atividade"}
        >
            <ToastContainer />
            <br />
            <span className={styles.span}>
                <Switch 
                    valor1={'ProEJA'} 
                    valor2={'Integrado'} 
                    valor={modalidade} 
                    stateHandler={trocarModalidade} 
                    imagemCustom={state ? <img src={lock} style={{width: '25px', height: '25px'}}/> : <></>}
                />
            </span>
            <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
                <section className={styles.section}>
                    <div className={styles.formGroup}>
                        <Label titulo={'Título *'}>
                            <Input
                                onChange={(e) => { setFormData({ ...formData, titulo: e.target.value }) }}
                                onBlur={() => setErros({...erros, titulo: validarCampoObrigatorio(formData.titulo)})}
                                type={'text'}
                                valor={formData.titulo}
                                erro={erros?.titulo}
                            />
                        </Label>
                        <Label titulo={'Descrição *'}>
                            <textarea
                                onChange={(e) => { setFormData({ ...formData, descricao: e.target.value }) }}
                                onBlur={() => setErros({...erros, descricao: validarCampoObrigatorio(formData.descricao)})}
                                value={formData.descricao}
                                className={erros?.descricao ? styles.textAreaError : styles.textArea}
                            />
                            {erros?.descricao ? <MensagemErro mensagem={erros.descricao}/> : null}
                        </Label>
                    </div>
                    <span className={styles.span}>
                        <span className={styles.span}>
                            <label className={!formData.arquivo ? styles.labelInputVazio : styles.labelInput} htmlFor='arquivo'>
                                <img src={!formData.arquivo ? uploadCinza : uploadBranco} style={{width: '25px', height: '25px'}}/>
                                <p className={styles.p}>
                                    {
                                        !formData.arquivo ? (
                                            'Fazer Upload'
                                        ) : (
                                            limitadorDeTexto(formData?.arquivo?.name, 15)
                                        )
                                    } 
                                </p>
                                <input
                                    onChange={(e) => { 
                                        setFormData({ ...formData, arquivo: e.target.files[0] }) 
                                    }}
                                    type={'file'}
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    style={{display: 'none'}}
                                    id='arquivo'
                                    name='arquivo'
                                />
                            </label>
                        </span>
                    </span>
                    <Button texto={state ? 'Salvar' : 'Cadastrar'} tipo={'submit'} disabled={desabilitado}/>
                </section>
                <section className={styles.section}>
                    {
                        formData.arquivo ?  (
                            <div className={styles.pdfContainer}>
                                <PDFPreview pdfData={formData.arquivo?.data ?? formData.arquivo} pdfUrl={formData.arquivo?.image_url ?? null}/>
                            </div>
                        ) : <></>
                    }
                </section>
            </form>
        </FormContainer>
    )
}

export default AtividadeForm
