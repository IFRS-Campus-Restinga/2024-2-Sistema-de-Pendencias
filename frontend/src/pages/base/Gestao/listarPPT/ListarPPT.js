import { useEffect, useState } from 'react'
import './ListarPPT.css'
import { PPTService } from '../../../../services/emiPptService'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input'
import Button from '../../../../components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'


const ListarPPT = () => {
    const navegar = useNavigate();
    const [listaPPT, setListaPPT] = useState([])
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState([])
    const [formData, setFormData] = useState({
        curso: '',
        turmaOrigem: '',
        turmaProgressao: '',
        aluno: '',
        disciplina: '',
        professor: '',
        status: '',
        situacao: '',
        dataInicio: '',
        dataFim: ''
    })

    const filtrarDependencias = () => {
        console.log(formData)
        const dependenciasFiltradas = listaPPT.filter(ppt => 
          (formData.aluno === '' || ppt.aluno.nome?.toLowerCase().includes(formData.aluno.toLowerCase()) || ppt.aluno.email.toLowerCase().includes(formData.aluno.toLowerCase())) &&
          (formData.professor === '' || ppt.professor.nome?.toLowerCase().includes(formData.professor.toLowerCase()) || ppt.professor.email.toLowerCase().includes(formData.professor.toLowerCase())) &&
          (formData.curso === '' || ppt.curso.nome.toLowerCase().includes(formData.curso.toLowerCase())) &&
          (formData.disciplina === '' || ppt.disciplina.nome.toLowerCase().includes(formData.disciplina.toLowerCase())) &&
          (formData.turmaOrigem === '' || ppt.turmaOrigem.nome.toLowerCase().includes(formData.turmaOrigem.toLowerCase())) &&
          (formData.turmaProgressao === '' || ppt.turmaProgressao.nome.toLowerCase().includes(formData.turmaProgressao.toLowerCase())) &&
          (formData.status === '' || ppt.status.nome.toLowerCase().includes(formData.status.toLowerCase())) &&
          (formData.situacao === '' || ppt.situacao.nome.toLowerCase().includes(formData.situacao.toLowerCase())) &&
          (formData.dataInicio === '' || new Date(ppt.dataFim) >= new Date(ppt.dataInicio))
        );
        setDependenciasFiltradas(dependenciasFiltradas);
      };

    const detalhesPpt = async (id) => {
        try {
            console.log("id:", id);
            navegar(`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/detalhesPPT/${id}`)
        } catch (error) {
            console.error('Erro ao abrir detalhes: ', error)
        }
    }

    const fetchPPT = async () => {
        try {
            const res = await PPTService.list()

            if (res.status !== 200) throw new Error(res.response.data.mensagem)
            
            setListaPPT(res.data)
            console.log(res.data)
        } catch (error) {
            console.error('Erro ao buscar PPTs: ', error)
        }
    }

    useEffect(() => {
        fetchPPT()
    }, [])

    return (
        <>
        <FormContainer titulo='Lista de PPT' comprimento='90%'>
            <section className='sectionListarPPT'>
                <div className='divListarPPT'>
                    <label className='labelListarPPT'>
                        Buscar
                        <Input
                            tipo='text'
                            onChange={(e) => setFormData(prevData => ({ ...prevData, curso: e.target.value }))}
                            valor={formData.curso}
                        />
                    </label>
                </div>
            </section>
                <span className='containerButton'>
                    <Button
                        text='Buscar'
                        onClick={filtrarDependencias}
                    />
                    <Button
                        text='Limpar Campos'
                        color="#4A4A4A"
                    />
                    <Link to={`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroPPT`}>
                    <Button
                        text='Adicionar nova'
                        />
                    </Link>
                </span>
            <div className='containerTabelaListarPPT'>
                <table className='tabelaListarPPT'>
                    <thead className='cabecalhoListarPPT'>
                        <th>Aluno</th>
                        <th>Curso</th>
                        <th>Disciplina</th>
                        <th>Turma de Origem</th>
                        <th>Turma de Progressão</th>
                        <th>Status</th>
                        <th>Situação</th>
                        <th>Data Início</th>
                        <th>Data Final</th>
                        <th>Ações</th>
                    </thead>
                    <tbody className='corpoListarPPT'>
                        {
                            listaPPT.map((ppt) => (
                                <tr>
                                    <td>{ppt.aluno.nome || '-'}</td>
                                    <td>{ppt.curso.nome}</td>
                                    <td>{ppt.disciplina.nome}</td>
                                    <td>{ppt.turmaOrigem.numero}</td>
                                    <td>{ppt.turmaProgressao.numero}</td>
                                    <td>{ppt.status}</td>
                                    <td>{ppt.situacao}</td>
                                    <td>{new Date(ppt.dataInicio).toLocaleDateString('pt-BR')}</td>
                                    <td>{new Date(ppt.dataFim).toLocaleDateString('pt-BR')}</td>
                                    <td><Button text="cu" onClick={() => detalhesPpt(ppt.id)}>cu</Button></td>
                                </tr>
                                
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </FormContainer>
        </>
    )
}

export default ListarPPT