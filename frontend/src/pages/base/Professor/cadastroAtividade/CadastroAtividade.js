import FormContainer from '../../../../components/FormContainer/FormContainer'
import { ToastContainer, toast } from 'react-toastify'
import './CadastroAtividade.css'
import Input from '../../../../components/Input/Input'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../../../../components/Button/Button'
import { jwtDecode } from 'jwt-decode'
import { validarFormAtividade } from './validacoes'
import atividadeService from '../../../../services/atividadeService'
import Switch from '../../../../components/Switch/Switch'
import uploadCinza from '../../../../assets/upload-cinza.png'
import uploadBranco from '../../../../assets/upload-branco.png'

const CadastroAtividade = () => {
    const formRef = useRef()
    const location = useLocation()
    const { state } = location
    const [modalidade, setModalidade] = useState(location.pathname.split('/')[5] ?? 'Integrado')
    const [errors, setErrors] = useState(null)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        arquivo: '',
        professor: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })

    const trocarModalidade = () => {
        setModalidade(modalidade === 'Integrado' ? 'ProEJA' : 'Integrado')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const erro = validarFormAtividade(formData)
        setErrors(erro)

        if (!erro) {
            try {
                console.log(formData)
                const res = await atividadeService.criar(modalidade, formData)

                if (res.status !== 201) throw new Error(res)

                toast.success(
                    state?.plano_estudos ? "Atividade editada com sucesso!" : "Atividade cadastrada com sucesso!",
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

                setFormData({
                    titulo: '',
                    descricao: '',
                    arquivo: '',
                    professor: jwtDecode(sessionStorage.getItem('token')).idUsuario
                })

                formRef.current.reset()
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
      };


    return (
        <>
            <ToastContainer />
            <FormContainer titulo={'Nova Atividade'} onSubmit={handleSubmit} encType="multipart/form-data" ref={formRef}>
                <br />
                <div className="divCadastroAtividade">
                    <Switch valor1={'ProEJA'} valor2={'Integrado'} valor={modalidade} stateHandler={trocarModalidade} />
                </div>
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
                <label className="labelCadastroAtividade">
                    Descrição *
                    <textarea
                        onChange={(e) => { setFormData({ ...formData, descricao: e.target.value }) }}
                        value={formData.descricao}
                        className='textAreaCadastroAtividade'
                    />
                    {errors?.descricao ? (<p style={{ color: 'red', fontWeight: 400, fontSize: '12px' }}>{errors.descricao}</p>) : null}
                </label>
                <div className="divCadastroAtividade">
                    <p className='pCadastroAtividade'>
                        Escolha opcionalmente algum arquivo de conteúdo para a atividade
                    </p>
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
                        <div className='divCadastroAtividade'>
                            <input
                                onChange={(e) => { setFormData({ ...formData, arquivo: e.target.files[0] }) }}
                                type={'file'}
                                accept=".jpg, .jpeg, .png, .pdf"
                                style={{display: 'none'}}
                                id='arquivo'
                                name='arquivo'
                            />
                        </div>
                    </label>
                </div>
                <Button text={'Cadastrar'} tipo={'submit'} />
            </FormContainer>
        </>
    )
}

export default CadastroAtividade
