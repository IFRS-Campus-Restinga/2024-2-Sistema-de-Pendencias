import {ToastContainer, toast} from 'react-toastify'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import { useState } from 'react'
import './DadosAdicionaisAluno.css'
import { alunoService } from '../../../../services/alunoService'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'


const DadosAdicionaisAluno = () => {
    const redirect = useNavigate()
    const [formData, setFormData] = useState({
        nome_completo: '',
        cpf: '',
        matricula: '',
        data_nascimento: '',
        telefone: '',
        usuario: jwtDecode(sessionStorage.getItem('token')).idUsuario
    })

    const handlerSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await alunoService.addInfos(formData)

            if (res.status !== 200) throw new Error(res.mensagem)

            toast.success("Seus dados foram cadastrados com sucesso!, você será redirecionado", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff' },
                progressStyle: { backgroundColor: '#fff' }
            });

            setTimeout(() => {
                redirect(`/sessao/${jwtDecode(sessionStorage.getItem('token')).perfil}/${jwtDecode(sessionStorage.getItem('token')).idUsuario}`)
            }, 1000);

            setFormData({
                cpf: '',
                data_nascimento: '',
                matricula: '',
                nome_completo: '',
                telefone: ''
            })
        } catch (erro) {
            console.log(erro)
        }

    }

    return (
        <>
        <ToastContainer/>
        <FormContainer onSubmit={handlerSubmit} titulo='Dados Adicionais' >
            <label className='labelDadosAdicionaisAluno'> Nome Completo
                <input className='inputDadosAdicionaisAluno' type='text' 
                onChange={(e) => setFormData(prevData => ({ ...prevData, nome_completo: e.target.value }))}/>
            </label>
            <label className='labelDadosAdicionaisAluno'> CPF
                <input className='inputDadosAdicionaisAluno' type='text'            
                onChange={(e) => setFormData(prevData => ({ ...prevData, cpf: e.target.value }))}
                />
            </label>
            <label className='labelDadosAdicionaisAluno'> Matrícula
                <input className='inputDadosAdicionaisAluno' type='text'            
                onChange={(e) => setFormData(prevData => ({ ...prevData, matricula: e.target.value }))}
                />
            </label>
            <label className='labelDadosAdicionaisAluno'> Data de Nascimento
                <input className='inputDadosAdicionaisAluno' type='date'
                onChange={(e) => setFormData(prevData => ({ ...prevData, data_nascimento: e.target.value }))}
                />
            </label>
            <label className='labelDadosAdicionaisAluno'> Telefone
                <input className='inputDadosAdicionaisAluno' type='tel' 
                onChange={(e) => setFormData(prevData => ({ ...prevData, telefone: e.target.value }))}
                />
            </label>            
        </FormContainer>
        </>
    )
}

export default DadosAdicionaisAluno