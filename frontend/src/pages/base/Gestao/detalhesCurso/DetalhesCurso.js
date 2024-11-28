import { useLocation, useSearchParams } from 'react-router-dom'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import './DetalhesCurso.css'
import { compareAsc } from 'date-fns'
import { useEffect, useState } from 'react'
import cursoService from '../../../../services/cursoService'
import Tabela from '../../../../components/Tabela/Tabela'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const DetalhesCurso = () => {
    const location = useLocation()
    const { state } = location
    const [turmas, setTurmas] = useState([])
    const [disciplinas, setDisciplinas] = useState([])

    const fetchCurso = async () => {
        try {
            const res = await cursoService.getCursoById(state.id)

            if (res.status !== 200) throw new Error(res)

            setTurmas(res.data.turmas)
            setDisciplinas(res.data.disciplinas)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCurso()
    }, [])

    return (
        <FormContainer titulo='Detalhes do Curso'>
            <section className='sectionDetalhesCurso'>
                <div className='divDetalhesCurso'>
                    <label className='labelDetalhesCurso'>
                        Nome 
                        <p className='pDetalhesCurso'>
                            {state.nome}
                        </p>
                    </label>
                    <label className='labelDetalhesCurso'>
                        Carga Horária 
                        <p className='pDetalhesCurso'>
                            {state.carga_horaria} horas/aula
                        </p>
                    </label>
                    <label className='labelDetalhesCurso'>
                        Coordenador 
                        <p className='pDetalhesCurso'>
                            {state.coordenador}
                        </p>
                    </label>
                    <label className='labelDetalhesCurso'>
                        Modalidade 
                        <p className='pDetalhesCurso'>
                            {state.modalidade}
                        </p>
                    </label>
                    {
                        state.modalidade === 'Integrado' ? (
                            <label className='labelDetalhesCurso'>
                                Turmas
                                <p className='pDetalhesCurso'>
                                    {
                                        turmas.map((turma) => (
                                            `${turma.numero}, `
                                        ))
                                    }
                                </p>
                            </label>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <div className='divDetalhesCurso'>
                    <p className='usoTabela'>Para remover uma disciplina deste curso, basta clicar na lixeira na respectiva linha</p>
                    <div className="containerTabelaDetalhesCurso">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Carga Horária</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    disciplinas.map((disciplina) => (
                                        <tr>
                                            <td>{disciplina.nome}</td>
                                            <td>{disciplina.carga_horaria}</td>
                                            <td className='acoesTabela'><FontAwesomeIcon  icon={faTrash} color='red'/></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

                
        </FormContainer>
    )
}

export default DetalhesCurso