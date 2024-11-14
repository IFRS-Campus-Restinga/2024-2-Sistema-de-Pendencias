import {ToastContainer, toast} from 'react-toastify'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Button from '../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import './PerfilProfessor.css'
import { useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Input from '../../../../components/Input/Input'
import { validarFormulario } from './validacoes'
import { usuarioBaseService } from '../../../../services/usuarioBaseService'
import servidorService from '../../../../services/servidorService'


const PerfilProfessor = () => {
    const {idUsuario} = useParams()
    const redirect = useNavigate()
    const [erros, setErros] = useState({})
    const [formData, setFormData] = useState({
        cpf: '',
        matricula: '',
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
        } else {
            try {
                const res = await servidorService.addInfos(formData)
    
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

    const fetchProfessor = async () => {
        try {
            const res = await usuarioBaseService.get(idUsuario)

            if (res.status !== 200) throw new Error(res.response.data.mensagem)

            setDadosUsuario({
                nome_completo: res.data.nome,
                email: res.data.email
            })

            setFormData({
                cpf: res.data.infos_professor.cpf || '',
                matricula: res.data.infos_professor.matricula || '',
                usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
            })

        } catch (erro) {
            console.error('Erro ao obter dados do usuário: ', erro)
        }
    }

    useEffect(() => {
        fetchProfessor()
    },[])

    return (
        <div className='perfilContainer'>
            <div className='containerDados'>
                <img src={jwtDecode(sessionStorage.getItem('token')).fotoPerfil } className='foto'/>
                <span className='nomeContainer'>{dadosUsuario.nome_completo}</span>
                <span className='emailContainer'>{dadosUsuario.email}</span>
            </div>
            <ToastContainer/>
            <FormContainer onSubmit={handlerSubmit} titulo='Dados Adicionais' >
                <label className='labelPerfilProfessor'> CPF
                    <Input
                        tipo='text'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, cpf: e.target.value }))}
                        valor={formData.cpf}
                        erro={erros.cpf}
                        alinharCentro={true}
                    />
                    {erros.cpf ? <p className='erro'>{erros.cpf}</p> : <></>}
                </label>
                <label className='labelPerfilProfessor'> Matrícula
                    <Input
                        tipo='text'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, matricula: e.target.value }))}
                        valor={formData.matricula}
                        erro={erros.matricula}
                        alinharCentro={true}
                        textoAjuda="Insira sua matrícula SIAPE"
                    />
                    {erros.matricula ? <p className='erro'>{erros.matricula}</p> : <></>}
                </label>
                <Button tipo='submit' text='Salvar Dados'/>        
            </FormContainer>
        </div>
    )
}

export default PerfilProfessor