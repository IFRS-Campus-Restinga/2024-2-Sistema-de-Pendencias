import FormContainer from '../../../../components/FormContainer/FormContainer'
import { ToastContainer, toast } from 'react-toastify'
import './CadastroAtividade.css'
import Input from '../../../../components/Input/Input'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../../../../components/Button/Button'
import { jwtDecode } from 'jwt-decode'
import { validarFormAtividade } from './validacoes'
import atividadeService from '../../../../services/atividadeService'
import Switch from '../../../../components/Switch/Switch'
import uploadCinza from '../../../../assets/upload-cinza.png'
import uploadBranco from '../../../../assets/upload-branco.png'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingIFRS from '../../../../components/LoadingIFRS/LoadingIFRS'
import PDFPreview from '../../../../components/PDFPreview/PDFPreview'

const CadastroAtividade = () => {
    const formRef = useRef()
    const location = useLocation()
    const { state } = location
    const [modalidade, setModalidade] = useState(state?.modalidade ?? 'Integrado')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [errors, setErrors] = useState(null)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        arquivo: '',
        professor: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })

    const trocarModalidade = () => {
        if (!state) {
            setModalidade(modalidade === 'Integrado' ? 'ProEJA' : 'Integrado')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSending(true)

        const erro = validarFormAtividade(formData)
        setErrors(erro)

        if (!erro) {
            try {
                let res
                if (state) {
                    res = await atividadeService.editar(state.id, modalidade, formData)

                    if (res.status !== 200) throw new Error(res)

                    } else {
                        res = await atividadeService.criar(modalidade, formData)
                        
                        if (res.status !== 201) throw new Error(res)
                            
                        setFormData({
                            titulo: '',
                            descricao: '',
                            arquivo: '',
                            professor: jwtDecode(sessionStorage.getItem('token')).idUsuario
                        })
                }

                toast.success(
                    state ? "Atividade editada com sucesso!" : "Atividade cadastrada com sucesso!",
                    {
                        position: "bottom-center",
                        autoClose: 3000,
                        style: {
                            backgroundColor: "#28A745",
                            color: "#fff",
                            textAlign: "center",
                        },
                        progressStyle: { backgroundColor: "#fff" },
                    }
                )

                setIsSending(false)
            } catch (error) {
                console.error(error)
            }
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
            const res = await atividadeService.porId(state.id, modalidade)

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

    if (isLoading) return <LoadingIFRS/>

    return (
        <>
            <ToastContainer />
            <FormContainer titulo={state ? 'Editar Atividade' : 'Cadastrar Atividade'} onSubmit={handleSubmit} encType="multipart/form-data" ref={formRef}>
                <br />
                <span className="spanCadastroAtividade">
                    <Switch 
                        valor1={'ProEJA'} 
                        valor2={'Integrado'} 
                        valor={modalidade} 
                        stateHandler={trocarModalidade} 
                        imagemCustom={state ? <FontAwesomeIcon icon={faLock} size="xl" color={modalidade === 'Integrado' ? '#006b3f' : '#fff'}/> : <></>}
                    />
                </span>
                <section className='sectionCadastroAtividade'>
                    <div className='divCadastroAtividade'>
                        <label className="labelCadastroAtividade">
                            Título *
                            <Input
                                onChange={(e) => { setFormData({ ...formData, titulo: e.target.value }) }}
                                type={'text'}
                                valor={formData.titulo}
                                erro={errors?.titulo}
                            />
                            {errors?.titulo ? (<p style={{ color: 'red', fontWeight: 400, fontSize: '12px' }}>{errors.titulo}</p>) : null}
                        </label>
                        <label className="labelTextArea">
                            Descrição *
                            <textarea
                                onChange={(e) => { setFormData({ ...formData, descricao: e.target.value }) }}
                                value={formData.descricao}
                                className='textAreaCadastroAtividade'
                            />
                            {errors?.descricao ? (<p style={{ color: 'red', fontWeight: 400, fontSize: '12px' }}>{errors.descricao}</p>) : null}
                        </label>
                    </div>
                    {
                        state ? (
                            <div className='divPDF'>
                                {
                                    formData.arquivo ?  (
                                        <PDFPreview pdfData={formData.arquivo?.data ?? formData.arquivo} pdfUrl={formData.arquivo?.image_url ?? null}/>
                                    ) : <></>
                                }
                            </div>
                        ) : <></>
                    }
                </section>
                <span className="spanCadastroAtividade">
                    <span className='spanCadastroAtividade'>
                        <label className={!formData.arquivo ? "labelInputVazio" : "labelInputArquivo"} htmlFor='arquivo'>
                            <img src={!formData.arquivo ? uploadCinza : uploadBranco} style={{width: '25px', height: '25px'}}/>
                            <p>
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
                <Button text={state ? 'Salvar' : 'Cadastrar'} tipo={'submit'} disabled={isSending}/>
            </FormContainer>
        </>
    )
}

export default CadastroAtividade
