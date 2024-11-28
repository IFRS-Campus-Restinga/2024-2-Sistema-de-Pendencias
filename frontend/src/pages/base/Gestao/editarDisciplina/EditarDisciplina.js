import { useLocation } from "react-router-dom"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { useEffect, useState } from "react"
import { disciplinaService } from "../../../../services/disciplinaService"
import Input from "../../../../components/Input/Input"
import cursoService from "../../../../services/cursoService"
import './EditarDisciplina.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import Button from "../../../../components/Button/Button"

const EditarDisciplina = () => {
    const location = useLocation()
    const { state } = location
    const [errors, setErrors] = useState([])
    const [cursos, setCursos] = useState([])
    const [cursosVinculados, setCursosVinculados] = useState([])
    const [formData, setFormData] = useState({
        nome: '',
        carga_horaria: '',
        cursos: []
    })

    const handleSubmit = () => {

    }

    const desvincularCurso = async (cursoId) => {
        setFormData({...formData, cursos: formData.cursos.append(cursoId)})
        try {
            const res = await disciplinaService.desvincular(state.id, cursoId)

            if (res.status !== 200) throw new Error(res)

            fetchDisciplina()
        } catch (error) {
            console.error(error)
        }
    }

    const vincularCurso = async (cursoId) => {
        try {
            const res = await disciplinaService.vincular(state.id, cursoId)

            if (res.status !== 200) throw new Error(res)

            fetchDisciplina()
        } catch (error) {
            console.error(error)
        }
    }

    const fetchDisciplina = async () => {
        try {
            const res = await disciplinaService.porId(state.id)

            if (res.status !== 200) throw new Error(res)
            
            setFormData(res.data.disciplina)
            setCursos(res.data.cursos)
            setCursosVinculados(res.data.cursos_vinculados)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDisciplina()
    },[])

    return (
        <FormContainer titulo={'Editar Disciplina'} onSubmit={handleSubmit}>
            <label className="labelEditarDisciplina">
                Nome
                <Input
                    type='text'
                    valor={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    erro={errors.nome}
                />
            </label>
            <label className="labelEditarDisciplina">
                Carga Horária
                <Input
                    type='text'
                    valor={formData.carga_horaria}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    erro={errors.carga_horaria}
                />
            </label>
            <section className="sectionEditarDisciplina">
                <div className="containerTabelaEditarDisciplina">
                    <table>
                        <thead>
                            <tr>
                                <th>Cursos</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cursos.map((curso) => (
                                    <tr onClick={() => vincularCurso(curso.id)}>
                                        <td>{curso.nome}</td>
                                        <td><FontAwesomeIcon icon={faAnglesRight}/></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="containerTabelaEditarDisciplina">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Cursos da Disciplina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cursosVinculados.map((curso) => (
                                    <tr onClick={() => desvincularCurso(curso.id)}>
                                        <td><FontAwesomeIcon icon={faAnglesLeft}/></td>
                                        <td>{curso.nome}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </section>
            <Button text={'Salvar Alterações'}/>
        </FormContainer>
    )
}


export default EditarDisciplina