import {ToastContainer, toast} from 'react-toastify'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Button from '../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import './PerfilAluno.css'
import { alunoService } from '../../../../services/alunoService'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'


const PerfilAluno = () => {
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

            if (res.status !== 201) throw new Error(res.mensagem)

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

    useEffect(() => {

    }, )

    return (
        <div className='perfilContainer'>
            <div className='containerDados'>
                <img src={jwtDecode(sessionStorage.getItem('token')).fotoPerfil } className='foto'/>
                <span className='nomeContainer'>{`${jwtDecode(sessionStorage.getItem('token')).primeiroNome}`}</span>
                <span className='emailContainer'>2023017100@aluno.restinga.ifrs.edu.br</span>
            </div>
            <div className='containerForm'>
                <ToastContainer/>
                <FormContainer onSubmit={handlerSubmit} titulo='Dados Adicionais' >
                    <label className='labelPerfilAluno'> Nome Completo
                        <input className='inputPerfilAluno' type='text' 
                        onChange={(e) => setFormData(prevData => ({ ...prevData, nome_completo: e.target.value }))}/>
                    </label>
                    <label className='labelPerfilAluno'> CPF
                        <input className='inputPerfilAluno' type='text'            
                        onChange={(e) => setFormData(prevData => ({ ...prevData, cpf: e.target.value }))}
                        />
                    </label>
                    <label className='labelPerfilAluno'> Matrícula
                        <input className='inputPerfilAluno' type='text'            
                        onChange={(e) => setFormData(prevData => ({ ...prevData, matricula: e.target.value }))}
                        />
                    </label>
                    <label className='labelPerfilAluno'> Data de Nascimento
                        <input className='inputPerfilAluno' type='date'
                        onChange={(e) => setFormData(prevData => ({ ...prevData, data_nascimento: e.target.value }))}
                        />
                    </label>
                    <label className='labelPerfilAluno'> Telefone
                        <input className='inputPerfilAluno' type='tel' 
                        onChange={(e) => setFormData(prevData => ({ ...prevData, telefone: e.target.value }))}
                        />
                    </label>
                    <Button tipo='submit' text='Salvar Dados'/>        
                </FormContainer>
            </div>
        </div>
    )
}

export default PerfilAluno