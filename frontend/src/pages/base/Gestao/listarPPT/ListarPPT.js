import { useEffect, useState } from 'react'
import './ListarPPT.css'
import { PPTService } from '../../../../services/PPTService'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input'


const ListarPPT = () => {
    const [listaPPT, setListaPPT] = useState([])
    const [formData, setFormData] = useState({
        curso: '',
        turmaOrigem: '',
        turmaProgressao: '',
        aluno: '',
        disciplina: '',
        professor: '',
        status: '',
        situacao: ''
    })

    const fetchPPT = async () => {
        try {
            const res = await PPTService.list()

            if (res.status != 200) throw new Error(res.response.data.mensagem)
            
            setListaPPT(res.data)
        } catch (error) {
            console.error('Erro ao buscar PPTs: ', error)
        }
    }

    useEffect(() => {
        fetchPPT()
    }, [])

    return (
        <>
        <FormContainer titulo='Consultar PPT'>
            <label className='labelListarPPT'>
                Filtrar por Curso
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, curso: e.target.value }))}
                    valor={formData.curso}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Turma de Origem
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, turmaOrigem: e.target.value }))}
                    valor={formData.turmaOrigem}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Turma de Progressão
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, turmaProgressao: e.target.value }))}
                    valor={formData.turmaProgressao}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Aluno
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, aluno: e.target.value }))}
                    valor={formData.aluno}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Disciplina
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, disciplina: e.target.value }))}
                    valor={formData.disciplina}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Professor
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, professor: e.target.value }))}
                    valor={formData.professor}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Status
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, status: e.target.value }))}
                    valor={formData.status}
                />
            </label>
            <label className='labelListarPPT'>
                Filtrar por Situação
                <Input
                    tipo='text'
                    onChange={(e) => setFormData(prevData => ({ ...prevData, situacao: e.target.value }))}
                    valor={formData.situacao}
                />
            </label>

            <div className='divListarPPT'>

            </div>
        </FormContainer>
        </>
    )
}

export default ListarPPT