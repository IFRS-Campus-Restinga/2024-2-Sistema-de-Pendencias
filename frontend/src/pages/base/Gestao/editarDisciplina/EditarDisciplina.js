import { useLocation } from "react-router-dom"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { useEffect, useState } from "react"
import { disciplinaService } from "../../../../services/disciplinaService"
import Input from "../../../../components/Input/Input"
import './EditarDisciplina.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import Button from "../../../../components/Button/Button"
import { validarFormEditarDisciplina } from "./validacoes"
import {ToastContainer, toast} from 'react-toastify'

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const erros = validarFormEditarDisciplina(formData)

        if (Object.keys(erros).length !== 0) setErrors(erros)
        else {
            try {
                const res = await disciplinaService.editar(formData, state.id)

                if (res.status !== 200) throw new Error(res)

                setFormData({
                    nome: '',
                    carga_horaria: '',
                    cursos: []
                })

                toast.success("Disciplinas cadastradas e vinculadas ao curso com sucesso!", {
                    position: "bottom-center",
                    autoClose: 3000,
                    style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
                    progressStyle: { backgroundColor: '#fff' }
                });

            } catch (error) {
                console.error(error)

                toast.error('Erro ao cadastrar curso, tente novamente', {
                    position: "bottom-center",
                    autoClose: 3000,
                    style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
                    progressStyle: { backgroundColor: '#fff' }
                  });
            }
        }

    }

    const desvincularCurso = async (curso) => {
        setFormData({
            ...formData,
            cursos: formData.cursos.filter((id) => id !== curso.id),
        });
        setCursos([...cursos, curso]);
        setCursosVinculados(cursosVinculados.filter((c) => c.id !== curso.id));
    };
    
    const vincularCurso = async (curso) => {
        setFormData({
            ...formData,
            cursos: [...formData.cursos, curso.id],
        });
        setCursosVinculados([...cursosVinculados, curso]);
        setCursos(cursos.filter((c) => c.id !== curso.id));
    };

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
        <>
            <ToastContainer/>
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
                        onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
                        erro={errors.carga_horaria}
                    />
                </label>
                <section className="sectionEditarDisciplina">
                    <div className="containerTabelaEditarDisciplina">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cursos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cursos.map((curso) => (
                                        <tr onClick={() => vincularCurso(curso)}>
                                            <td>
                                                <div className="divEditarDisciplina">
                                                    <p className="pEditarDisciplina">{curso.nome}</p>
                                                    <FontAwesomeIcon icon={faAnglesRight}/>
                                                </div>
                                            </td>
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
                                    <th>Cursos da Disciplina</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cursosVinculados.map((curso) => (
                                        <tr onClick={() => desvincularCurso(curso)} className="trEditarDisciplina">
                                            <td>
                                            <div className="divEditarDisciplina">
                                                    <FontAwesomeIcon icon={faAnglesLeft}/>
                                                    <p className="pEditarDisciplina">{curso.nome}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
                <Button text={'Salvar Alterações'} tipo={'submit'}/>
            </FormContainer>
        </>
    )
}


export default EditarDisciplina