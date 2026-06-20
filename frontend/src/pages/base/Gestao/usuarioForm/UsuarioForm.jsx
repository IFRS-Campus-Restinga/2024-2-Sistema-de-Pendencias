import styles from './UsuarioForm.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import CustomLoading from '../../../../components/customLoading/CustomLoading'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input'
import { UsuarioService } from '../../../../services/usuarioService'
import OpcoesBusca from '../../../../components/OpcoesBusca/OpcoesBusca'
import Label from '../../../../components/Label/Label'
import GrupoService from '../../../../services/grupoService'
import MensagemErro from '../../../../components/MensagemErro/MensagemErro'
import { validarCampoUUID4 } from '../../../../utils/validacoes'
import Button from '../../../../components/Button/Button'
import Switch from '../../../../components/Switch/Switch'


const UsuarioForm = () => {
    const redirect = useNavigate()
    const location = useLocation()
    const { state } = location
    const perfil = location.pathname.split('/')[3]
    const [carregandoUsuario, setCarregandoUsuario] = useState(true)
    const [carregandoGrupos, setCarregandoGrupos] = useState(true)
    const [buscaUsuario, setBuscaUsuario] = useState('')
    const [emailUsuario, setEmailUsuario] = useState('')
    const [opcoesUsuarios, setOpcoesUsuarios] = useState([])
    const [opcoesGrupos, setOpcoesGrupos] = useState([])
    const [formData, setFormData] = useState({
        id: state,
        group: '',
        is_active: true
    })
    const [erros, setErros] = useState({
        id: null,
        group: null
    })

    const grupoMap = {
        'gestao_escolar': 'Gestão Escolar',
        'coord': 'Coordenador',
        'professor': 'Professor',
        'aluno': 'Aluno',
        'coord_reg_esc': 'CRE'
    }

    const fetchUsuario = async () => {
        try {
            const res = await UsuarioService.obter(state)

            setBuscaUsuario(res.data.username)
            setEmailUsuario(res.data.email)
            setFormData({
                id: res.data.id,
                group: res.data.group,
                is_active: res.data.is_active ?? true
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response.data.message)
            } else {
                console.error(error)
            }
        } finally {
            setCarregandoUsuario(false)
        }
    }

    const fetchUsuarios = async () => {
        try {
            const res = await UsuarioService.buscarHub(undefined, buscaUsuario, perfil === 'alunos' ? 'aluno' : 'servidor', 'id, username, email')

            setOpcoesUsuarios(res.data.results)
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response.data.message)
            } else {
                console.error(error)
            }
        }
    }

    const fetchGrupos = async () => {
        try {
            const res = await GrupoService.listar()

            setOpcoesGrupos(res.data.results)
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response.data.message)
            } else {
                console.error(error)
            }
        } finally {
            setCarregandoGrupos(false)
        }
    }

    const validarForm = () => {
        let novosErros = {
            id: null,
            group: null
        }

        for (let campo in formData) {
            switch (campo) {
                case 'id':
                    novosErros.id = validarCampoUUID4(formData.id)
                    break;
                case 'group':
                    novosErros.group = validarCampoUUID4(formData.group)
                    break;
                default:
                    break;
            }
        }

        setErros(novosErros)
        return Object.values(novosErros).every((erro) => erro === null)
    }

    const enviar = async (e) => {
        e.preventDefault()

        if (validarForm()) {
            toast.promise(
                state
                ? UsuarioService.editar(state, formData)
                : UsuarioService.criar(formData),
                {
                    pending: state ? "Salvando alterações..." : "Cadastrando usuário...",
                    success: {
                        render({ data }) {
                        return data.data.message;
                        },
                    },
                    error: "Erro de validação"
                }
            ).then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setTimeout(() => {
                        redirect(`/session/gestao_escolar/${perfil}`)
                    }, 3000);
                }
            }).catch((err) => {
                if (err instanceof AxiosError) {
                    const errors = err.response?.data?.message;

                    if (Array.isArray(errors)) {
                        errors.forEach((msg) => toast.error(msg));
                    } else {
                        toast.error(errors);
                    }
                }
            })
        }
    }

    useEffect(() => {
        fetchGrupos()

        if (state) {
            fetchUsuario()
        } else {
            setCarregandoUsuario(false)
        }

    }, [state, perfil])

    return (
        <FormContainer titulo={state ? perfil === 'alunos' ? 'Detalhes aluno' : `Editar Servidor` : `Cadastrar ${perfil}`} comprimento={'50%'} textoInfo={"Preencha os campos obrigatórios (*)\n\nUtilize o campo superior para buscar um usuário\nUtilize os botões para definir o grupo."}>
            <ToastContainer autoClose={2000} position="bottom-right" />
            <form className={styles.form} onSubmit={enviar}>
                <div className={styles.formGroup}>
                    <Label titulo={'Usuário *'}>
                        <div className={styles.inputContainer}>

                            <Input
                                valor={buscaUsuario}
                                desabilitado={state ? true : false}
                                textoAjuda={`Pesquise por ${perfil}`}
                                onChange={(e) => {
                                    setBuscaUsuario(e.target.value)
                                    fetchUsuarios()
                                }}
                            />
                            {erros.id ? <MensagemErro mensagem={erros.id}/> : null}
                            {
                                opcoesUsuarios.length > 0 ? (
                                    <OpcoesBusca
                                        opcoes={opcoesUsuarios}
                                        chave={'username'}
                                        setValor={(opcao) => {
                                            setBuscaUsuario(opcao.username)
                                            setEmailUsuario(opcao.email)
                                            setFormData({...formData, id: opcao.id})
                                            setOpcoesUsuarios([])
                                        }}
                                        />
                                    ) : null
                            }
                        </div>
                    </Label>
                </div>
                {
                    carregandoUsuario ? (
                        <CustomLoading/>
                    ) : (
                        emailUsuario.length > 0 ? (
                            <div className={styles.formGroup}>
                                <Label titulo={'Email do Usuário'}>
                                    <Input
                                        valor={emailUsuario}
                                        desabilitado={true}
                                    />
                                </Label>
                            </div>
                        ) : null
                    )
                }
                <div className={styles.formGroup}>
                    {
                        carregandoGrupos ? (
                            <CustomLoading/>
                        ) : (
                            <Label titulo={'Grupos *'}>
                                <div className={styles.containerOpcoes}> 
                                {
                                    opcoesGrupos.map((grupo) => (
                                        grupo.name === 'aluno' &&
                                        perfil === 'alunos' ||
                                        grupo.name !== 'aluno' &&
                                        perfil === 'servidores' ? (
                                            <label htmlFor={grupo.id} className={styles.grupoLabel}>
                                                {grupoMap[grupo.name]}
                                                <input 
                                                    type="radio" 
                                                    id={grupo.id} 
                                                    value={grupo.id} 
                                                    className={styles.grupoInput} 
                                                    checked={formData.group === grupo.id}
                                                    onChange={(e) => setFormData({...formData, group: e.target.value})}
                                                    onBlur={() => setErros({...formData, group: validarCampoUUID4(formData.group)})}
                                                />
                                            </label>
                                        ) : null
                                    ))
                                }
                                </div>
                                {erros.group ? <MensagemErro mensagem={erros.group}/> : null}
                            </Label>
                        )
                    }
                </div>
                <div className={styles.formGroup}>
                    <Label titulo={'Situação'}>
                        <Switch
                            valor1='Ativo'
                            valor2='Inativo'
                            valor={formData.is_active ? 'Ativo' : 'Inativo'}
                            stateHandler={(v) => setFormData(prev => ({...prev, is_active: v === 'Ativo'}))}
                        />
                    </Label>
                </div>
                <Button texto={state ? 'Editar' : 'Cadastrar'} tipo='submit'/>
            </form>
        </FormContainer>
    )
}

export default UsuarioForm