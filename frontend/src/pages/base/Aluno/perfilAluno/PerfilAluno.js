import {ToastContainer, toast} from 'react-toastify'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Button from '../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import './PerfilAluno.css'
import { alunoService } from '../../../../services/alunoService'
import { useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Input from '../../../../components/Input/Input'
import { validarFormulario } from './validacoes'
import { usuarioBaseService } from '../../../../services/usuarioBaseService'


const PerfilAluno = () => {
    const {idUsuario} = useParams()
    const redirect = useNavigate()
    const [erros, setErros] = useState({})
    const [showMessage, setShowMessage] = useState(false)
    const [desabilitado, setDesabilitado] = useState(false)
    const [formData, setFormData] = useState({
        cpf: '',
        matricula: '',
        data_nascimento: '',
        telefone: '',
        usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })
    const [dadosUsuario, setDadosUsuario] = useState({
        nome_completo: '',
        email: ''
    })

    const handlerSubmit = async (e) => {
        e.preventDefault()

        const erros = validarFormulario(formData)

        if (Object.keys(erros).length > 0) {
            setErros(erros)
            setShowMessage(true)
        } else {
            try {
                const res = await alunoService.addInfos(formData)
    
                if (res.status === 201) {
                    toast.success("Seus dados foram cadastrados com sucesso!, você será redirecionado", {
                        position: "bottom-center",
                        autoClose: 3000,
                        style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
                        progressStyle: { backgroundColor: '#fff' }
                    });
        
                    setTimeout(() => {
                        redirect(`/sessao/${jwtDecode(sessionStorage.getItem('token')).perfil}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`)
                    }, 2000)
                } else if (res.status === 200) {
                    toast.success("Informações atualizadas com sucesso!", {
                        position: "bottom-center",
                        autoClose: 3000,
                        style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center'},
                        progressStyle: { backgroundColor: '#fff' }
                    });
                }
    

                setErros({})
                setShowMessage(false)
            } catch (erro) {
                console.error('Erro ao cadastrar informações: ', erro)
                toast.error("Falha na operação. Tente novamente.", {
                    position: "bottom-center",
                    autoClose: 3000,
                    style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
                    progressStyle: { backgroundColor: '#fff' }
                });
            }
        }
    }

    const fetchAluno = async () => {
        try {
            const res = await Promise.all([
                usuarioBaseService.get({idUsuario: jwtDecode(sessionStorage.getItem('token')).idUsuario}, idUsuario),
                alunoService.getInfos({idAluno: jwtDecode(sessionStorage.getItem('token')).idUsuario}, idUsuario)
            ])

            if (res[0].status !== 200) throw new Error(res[0].response.data.mensagem)
            if (res[1].status !== 200) throw new Error(res[1].response.data.mensagem)

            setDadosUsuario({
                nome_completo: res[0].data.nome,
                email: res[0].data.email
            })

            setFormData({
                cpf: res[1].data.cpf || '',
                data_nascimento: res[1].data.data_nascimento || '',
                matricula: res[1].data.matricula || res[0].data.email.substring(0, 10),
                telefone: res[1].data.telefone || '',
                usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
            })

            console.log(res[0].data.primeiro_login)

            if (res[0].data.primeiro_login) {
                setDesabilitado(true)
            } else {
                setDesabilitado(false)
            }

        } catch (erro) {
            console.error('Erro ao obter dados do usuário: ', erro)
        }
    }

    useEffect(() => {
        fetchAluno()
    },[])

    return (
        <div className='perfilContainer'>
            <div className='containerDados'>
                <img src={jwtDecode(sessionStorage.getItem('token')).fotoPerfil } className='foto'/>
                <span className='nomeContainer'>{dadosUsuario.nome_completo}</span>
                <span className='emailContainer'>{dadosUsuario.email}</span>
            </div>
            <div className='containerForm'>
                <ToastContainer/>
                <FormContainer onSubmit={handlerSubmit} titulo='Dados Adicionais' >
                    <label className='labelPerfilAluno'> CPF
                        <Input
                            tipo='text'
                            onChange={(e) => setFormData(prevData => ({ ...prevData, cpf: e.target.value }))}
                            valor={formData.cpf}
                            erro={erros.cpf}
                            desabilitado={desabilitado}
                            alinharCentro={true}
                        />
                        {erros.cpf ? <p className='erro'>{erros.cpf}</p> : <></>}
                    </label>
                    <label className='labelPerfilAluno'> Matrícula
                        <Input
                            tipo='text'
                            onChange={(e) => setFormData(prevData => ({ ...prevData, matricula: e.target.value }))}
                            valor={formData.matricula}
                            erro={erros.matricula}
                            desabilitado={false}
                            alinharCentro={true}
                        />
                        {erros.matricula ? <p className='erro'>{erros.matricula}</p> : <></>}
                    </label>
                    <label className='labelPerfilAluno'> Data de Nascimento
                        <Input
                            tipo='date'
                            onChange={(e) => setFormData(prevData => ({ ...prevData, data_nascimento: e.target.value }))}
                            valor={formData.data_nascimento}
                            erro={erros.data_nascimento}
                            desabilitado={desabilitado}
                            alinharCentro={true}
                        />
                        {erros.data_nascimento ? <p className='erro'>{erros.data_nascimento}</p> : <></>}
                    </label>
                    <label className='labelPerfilAluno'> Telefone
                        <Input
                            tipo='telephone'
                            onChange={(e) => setFormData(prevData => ({ ...prevData, telefone: e.target.value }))}
                            valor={formData.telefone}
                            erro={erros.telefone}
                            desabilitado={true}
                            alinharCentro={true}
                        />
                        {erros.telefone ? <p className='erro'>{erros.telefone}</p> : <></>}
                    </label>
                    <Button tipo='submit' text='Salvar Dados'/>        
                </FormContainer>
            </div>
        </div>
    )
}

export default PerfilAluno