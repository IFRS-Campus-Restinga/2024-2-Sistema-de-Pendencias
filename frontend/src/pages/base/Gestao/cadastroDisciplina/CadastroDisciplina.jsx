import { useLocation, useNavigate } from "react-router-dom"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import { useEffect, useState } from "react"
import { disciplinaService } from "../../../../services/disciplinaService"
import Input from "../../../../components/Input/Input"
import styles from './CadastroDisciplina.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import Button from "../../../../components/Button/Button"
import { ToastContainer, toast } from 'react-toastify'
import cursoService from "../../../../services/cursoService"
import Loading from "../../../../components/Loading/Loading"
import Label from "../../../../components/Label/Label"
import { validarCargaHoraria, validarNome } from "../../../../utils/validacoes"
import MensagemErro from "../../../../components/MensagemErro/MensagemErro"

const CadastroDisciplina = () => {
    const location = useLocation()
    const { state } = location
    const redirect = useNavigate()
    const [carregando, setCarregando] = useState(true)
    const [erros, setErros] = useState({})
    const [cursos, setCursos] = useState([])
    const [formData, setFormData] = useState({
        nome: '',
        carga_horaria: '',
        cursos: []
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (true) {
            let req

            if (state) {
                req = disciplinaService.editar(formData, state)
            } else {
                req = disciplinaService.criar(formData)
            }

            toast.promise(
                (async () => {
                    const res = await req;

                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error(JSON.stringify(["Erro ao registrar curso"]));
                    }

                    setErros({
                        nome: '',
                        carga_horaria: '',
                        cursos: ''
                    });

                    // Redirecionar após um tempo
                    setTimeout(() => {
                        redirect('/Gestão Escolar/disciplinas/');
                    }, 3000);

                    return res;
                })(),
                {
                    pending: 'Realizando registro...',
                    success: 'Registro realizado com sucesso!',
                    error: {
                        render({ data }) {
                            if (data instanceof Error) {
                                try {
                                    const mensagens = JSON.parse(data.message);

                                    if (Array.isArray(mensagens)) {
                                        mensagens.forEach((mensagem, index) => {
                                            if (index > 0) {
                                                toast.error(mensagem, {
                                                    autoClose: 3000,
                                                    position: 'bottom-center',
                                                    style: { textAlign: 'center', whiteSpace: 'pre-line' },
                                                });
                                            }
                                        });

                                        return mensagens[0];
                                    }

                                    return 'Erro ao registrar disciplina.';
                                } catch (e) {
                                    return 'Erro inesperado ao processar mensagens.';
                                }
                            }

                            return 'Erro ao registrar disciplina.';
                        }
                    }
                },
                {
                    autoClose: 3000,
                    position: 'bottom-center',
                    style: { textAlign: 'center', whiteSpace: 'pre-line' }
                }
            );
        }
    }

    const vincularCurso = (curso) => {
        setFormData({
            ...formData,
            cursos: [...formData.cursos, curso],
        });

        setCursos(cursos.filter((c) => c.id !== curso.id));
    };

    const desvincularCurso = (curso) => {
        setFormData({
            ...formData,
            cursos: formData.cursos.filter((c) => c.id !== curso.id),
        });

        setCursos([...cursos, curso]);
    };

    const fetchDisciplina = async () => {
        try {
            const res = await disciplinaService.porId(state)

            if (res.status !== 200) throw new Error(res)

            setFormData({
                nome: res.data.disciplina.nome,
                carga_horaria: res.data.disciplina.carga_horaria,
                cursos: res.data.cursos_vinculados
            })

            setCursos(res.data.cursos)
        } catch (error) {
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    const fetchCursos = async () => {
        try {
            const res = await cursoService.listar('disciplina', null, null)

            if (res.status !== 200) throw new Error(res.data.mensagem)

            setCursos(res.data.results)
        } catch (error) {
            console.error(error.message)
        } finally {
            setCarregando(false)
        }
    }

    const validarForm = () => {
        let erro
        let validado = true
        let novosErros = {
            nome: '',
            carga_horaria: '',
            cursos: ''
        }

        for (let campo in formData) {
            switch (campo) {
                case 'nome':
                    erro = validarNome(formData.nome)
                    if (erro !== '') {
                        novosErros.nome = erro
                        validado = false
                    }
                    break;
                case 'carga_horaria':
                    erro = validarCargaHoraria(formData.carga_horaria)
                    if (erro !== '') {
                        novosErros.carga_horaria = erro
                        validado = false
                    }
                    break;
                case 'cursos':
                    if (formData.cursos.length === 0) {
                        novosErros.cursos = 'É obrigatório vincular cursos a uma disciplina'
                        validado = false
                    }
                default:
                    break;
            }
        }
        setErros(novosErros)
        return validado
    }

    useEffect(() => {
        if (state) {
            fetchDisciplina()
        } else {
            fetchCursos()
        }

    }, [state])

    return (
        <>
            <ToastContainer />
            <FormContainer titulo={state ? 'Editar Disciplina' : 'Cadastrar Disciplina'} onSubmit={handleSubmit} textoInfo={'Informe o nome e carga horária da disciplina\n\nToda disciplina deve ser vinculada a pelo menos um curso\n\nCaso existam progressões vinculadas a esta disciplina, ela não poderá ser desvinculada dos cursos atuais'}>
                {
                    carregando ? (
                        <Loading border={'green'} />
                    ) : (
                        <div className={styles.container}>
                            <div className={styles.formGroup}>
                                <Label titulo={'Nome'}>
                                    <Input
                                        type='text'
                                        max={70}
                                        valor={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        onBlur={() => setErros({ ...erros, nome: validarNome(formData.nome) })}
                                        erro={erros.nome}
                                    />
                                    {erros.nome !== '' ? <MensagemErro mensagem={erros.nome} /> : null}
                                </Label>
                                <Label titulo={'Carga Horária'}>
                                    <Input
                                        type='text'
                                        max={2}
                                        valor={formData.carga_horaria}
                                        onChange={(e) => setFormData({ ...formData, carga_horaria: e.target.value })}
                                        onBlur={() => setErros({ ...erros, carga_horaria: validarCargaHoraria(formData.carga_horaria) })}
                                        erro={erros.carga_horaria}
                                    />
                                    {erros.carga_horaria !== '' ? <MensagemErro mensagem={erros.carga_horaria} /> : null}
                                </Label>
                            </div>
                            <section className={styles.section}>
                                <div className={styles.containerTabela}>
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
                                                            <div className={styles.div}>
                                                                <p className={styles.p}>{curso.nome}</p>
                                                                <FontAwesomeIcon icon={faAnglesRight} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.containerTabela}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Cursos da Disciplina</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                formData.cursos.map((curso) => (
                                                    <tr onClick={() => desvincularCurso(curso)}>
                                                        <td>
                                                            <div className={styles.div}>
                                                                <FontAwesomeIcon icon={faAnglesLeft} />
                                                                <p className={styles.p}>{curso.nome}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                            {erros.cursos !== '' ? <MensagemErro mensagem={erros.cursos} /> : null}
                        </div>
                    )
                }
                <Button texto={state ? 'Salvar Alterações' : 'Cadastrar'} tipo={'submit'} />
            </FormContainer>
        </>
    )
}


export default CadastroDisciplina