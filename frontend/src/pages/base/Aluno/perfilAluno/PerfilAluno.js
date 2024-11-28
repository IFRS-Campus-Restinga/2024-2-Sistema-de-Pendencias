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
    const [desabilitado, setDesabilitado] = useState(false)
    const [erros, setErros] = useState({})
    const [formData, setFormData] = useState({
        cpf: '',
        matricula: '',
        data_nascimento: '',
        usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })
    const [dadosUsuario, setDadosUsuario] = useState({
        nome: '',
        email: ''
    })

    const handlerSubmit = async (e) => {
        e.preventDefault()

        const erros = validarFormulario(formData)

        if (Object.keys(erros).length > 0) {
            setErros(erros)
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
                        redirect(`/sessao/${jwtDecode(sessionStorage.getItem('token')).grupo}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`)
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
            const res = await usuarioBaseService.get(idUsuario)

            if (res.status !== 200) throw new Error(res.response.data.mensagem)

            setDadosUsuario({
                nome: res.data.nome,
                email: res.data.email
            })

            setFormData({
                cpf: res.data.cpf,
                data_nascimento: res.data.data_nascimento,
                matricula: res.data.matricula || res.data.email.substring(0, 10),
                telefone: res.data.telefone,
                usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
            })

            console.log(res.data)

            setDesabilitado(!res.data.primeiro_login)

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
                <span className='nomeContainer'>{dadosUsuario.nome}</span>
                <span className='emailContainer'>{dadosUsuario.email}</span>
            </div>
            <ToastContainer/>
            <FormContainer onSubmit={handlerSubmit} titulo='Dados Adicionais' >
                <label className='labelPerfilAluno'> CPF
                    <Input
                        tipo='text'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, cpf: e.target.value }))}
                        valor={formData.cpf || ''}
                        erro={erros.cpf}
                        alinharCentro={true}
                        desabilitado={desabilitado}
                    />
                    {erros.cpf ? <p className='erro'>{erros.cpf}</p> : <></>}
                </label>
                <label className='labelPerfilAluno'> Matrícula
                    <Input
                        tipo='text'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, matricula: e.target.value }))}
                        valor={formData.matricula || ''}
                        erro={erros.matricula}
                        alinharCentro={true}
                        desabilitado={true}
                    />
                    {erros.matricula ? <p className='erro'>{erros.matricula}</p> : <></>}
                </label>
                <label className='labelPerfilAluno'> Data de Nascimento
                    <Input
                        type='date'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, data_nascimento: e.target.value }))}
                        valor={formData.data_nascimento || ''}
                        erro={erros.data_nascimento}
                        alinharCentro={true}
                        desabilitado={desabilitado}
                    />
                    {erros.data_nascimento ? <p className='erro'>{erros.data_nascimento}</p> : <></>}
                </label>
                <label className='labelPerfilAluno'> Telefone
                    <Input
                        tipo='telephone'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, telefone: e.target.value }))}
                        valor={formData.telefone || ''}
                        erro={erros.telefone}
                        alinharCentro={true}
                        desabilitado={false}
                    />
                    {erros.telefone ? <p className='erro'>{erros.telefone}</p> : <></>}
                </label>
                <Button tipo='submit' text='Salvar Dados'/>        
            </FormContainer>
        </div>
    )
}

export default PerfilAluno