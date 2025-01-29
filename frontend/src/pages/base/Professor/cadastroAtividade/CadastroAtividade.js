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

const CadastroAtividade = () => {
    const formRef = useRef()
    const location = useLocation()
    const { state } = location
    const [modalidade, setModalidade] = useState(location.pathname.split('/')[5] ?? 'Integrado')
    const [errors, setErrors] = useState(null)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        data_entrega: '',
        observacoes: '',
        arquivo: '',
        professor: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })

    const trocarModalidade = () => {
        setModalidade(modalidade === 'Integrado' ? 'ProEJA' : 'Integrado')
        console.log(modalidade)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const erro = validarFormAtividade(formData)
        setErrors(erro)

        if (!erro) {
            try {
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
                    data_entrega: '',
                    descricao: '',
                    observacoes: '',
                    arquivo: ''
                })

                formRef.current.reset()
            } catch (error) {
                console.error(error)
            }
        }
    }

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
                <div className="divCadastroAtividade">
                    <label className="labelCadastroAtividade">
                        Data de Entrega *
                        <Input
                            onChange={(e) => { setFormData({ ...formData, data_entrega: e.target.value }) }}
                            type={'date'}
                            valor={formData.data_entrega}
                            erro={errors?.data}
                            dataMinima={new Date().toISOString().split('T')[0]}
                        />
                        {errors?.data ? (<p style={{ color: 'red', fontWeight: 400, fontSize: '12px' }}>{errors.data}</p>) : null}
                    </label>
                    <label className="labelCadastroAtividade">
                        PDF atividade
                        <Input
                            onChange={(e) => { setFormData({ ...formData, arquivo: e.target.files[0] }) }}
                            type={'file'}
                            accept=".jpg, .jpeg, .png, .pdf"
                        />
                    </label>
                </div>
                <label className="labelCadastroAtividade">
                    Descrição *
                    <Input
                        onChange={(e) => { setFormData({ ...formData, descricao: e.target.value }) }}
                        type={'text'}
                        valor={formData.descricao}
                        erro={errors?.descricao}
                    />
                    {errors?.descricao ? (<p style={{ color: 'red', fontWeight: 400, fontSize: '12px' }}>{errors.descricao}</p>) : null}
                </label>
                <label className="labelCadastroAtividade">
                    Observações
                    <Input
                        onChange={(e) => { setFormData({ ...formData, observacoes: e.target.value }) }}
                        valor={formData.observacoes}
                        type={'text'}
                    />
                </label>
                <Button text={'Cadastrar'} tipo={'submit'} />
            </FormContainer>
        </>
    )
}

export default CadastroAtividade
