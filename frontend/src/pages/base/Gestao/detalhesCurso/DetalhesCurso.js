import { useLocation } from 'react-router-dom'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import './DetalhesCurso.css'
import { useEffect, useState } from 'react'
import cursoService from '../../../../services/cursoService'



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
                                    <span className='spanDetalhesCurso'>
                                        {
                                            turmas.map((turma) => (
                                                <p className='containerTurmas'>
                                                {turma.numero}
                                                </p>
                                            ))
                                        }
                                    </span>
                            </label>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <div className='divDetalhesCurso'>
                    <div className="containerTabelaDetalhesCurso">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Carga Horária</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    disciplinas.map((disciplina) => (
                                        <tr>
                                            <td>{disciplina.nome}</td>
                                            <td>{disciplina.carga_horaria}</td>
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