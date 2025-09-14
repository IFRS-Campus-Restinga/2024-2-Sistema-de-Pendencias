import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom'
import styles from './GrupoForm.module.css'
import { useEffect, useState } from 'react'
import GrupoService from '../../../../services/grupoService'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import { toast, ToastContainer } from 'react-toastify'
import PermissaoService from '../../../../services/permissaoService'
import TabelaDeTransferencia from '../../../../components/Tabela/Tabelas/TabelaTransferencia'
import CustomLoading from '../../../../components/customLoading/CustomLoading'
import Label from '../../../../components/Label/Label'
import Input from '../../../../components/Input/Input'
import { validarCampoObrigatorio } from '../../../../utils/validacoes'
import Button from '../../../../components/Button/Button'

const GrupoForm = () => {
    const { state } = useLocation()

    const [paginaDisponiveis, setPaginaDisponiveis] = useState(1)
    const [paginaDoGrupo, setPaginaDoGrupo] = useState(1)

    const [proximaDisponiveis, setProximaDisponiveis] = useState(null)
    const [anteriorDisponiveis, setAnteriorDisponiveis] = useState(null)

    const [proximaDoGrupo, setProximaDoGrupo] = useState(null)
    const [anteriorDoGrupo, setAnteriorDoGrupo] = useState(null)

    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([])
    const [permissoesGrupo, setPermissoesGrupo] = useState([])
    const [addPermissoes, setAddPermissoes] = useState([])
    const [remPermissoes, setRemPermissoes] = useState([])
    const [grupo, setGrupo] = useState({
        id: '',
        name: '',
    })

    const [carregandoGeral, setCarregandoGeral] = useState(true)
    const [carregandoDisponiveis, setCarregandoDisponiveis] = useState(true)
    const [carregandoGrupo, setCarregandoGrupo] = useState(true)

    const [erroNome, setErroNome] = useState(null)

    const buscarDadosDoGrupo = async () => {
        try {
            const res = await Promise.all([
                GrupoService.detalhes(state),
                PermissaoService.naoVinculadas(state, paginaDisponiveis),
                PermissaoService.listarPorGrupo(state, paginaDoGrupo)
            ])

            
            setGrupo(res[0].data)
            setPermissoesDisponiveis(res[1].data.results)
            setPermissoesGrupo(res[2].data.results)

            setProximaDisponiveis(res[1].data.next ? paginaDisponiveis + 1 : null)
            setAnteriorDisponiveis(res[1].data.prev ? paginaDisponiveis - 1 : null)

            setProximaDoGrupo(res[2].data.next ? paginaDoGrupo + 1 : null)
            setAnteriorDoGrupo(res[2].data.prev ? paginaDoGrupo - 1 : null)
        } catch (erro) {
            toast.error(erro.message || 'Erro ao carregar dados do grupo.', {
                autoClose: 2000,
                position: 'bottom-center'
            })
        } finally {
            setCarregandoGeral(false)
            setCarregandoDisponiveis(false)
            setCarregandoGrupo(false)
        }
    }

    const buscarPermissoesDoGrupo = async () => {
        setCarregandoGrupo(true)

        try {
            const res = await PermissaoService.listarPorGrupo(state, paginaDoGrupo)

            setPermissoesGrupo([...permissoesGrupo, ...res.data.results])

            setProximaDoGrupo(res.data.next ? paginaDoGrupo + 1 : null)
            setAnteriorDoGrupo(res.data.previous ? paginaDoGrupo - 1 : null)
        } catch (erro) {
            console.error(erro)
        } finally {
            setCarregandoGrupo(false)
        }
    }

    const buscarPermissoesDisponiveis = async () => {
        setCarregandoDisponiveis(true)

        try {
            const req = state ?
            PermissaoService.naoVinculadas(state, paginaDisponiveis) :
            PermissaoService.listar(paginaDisponiveis)

            const res = await req

            setPermissoesDisponiveis([...permissoesDisponiveis, ...res.data.results])

            setProximaDisponiveis(res.data.next ? paginaDisponiveis + 1 : null)
            setAnteriorDisponiveis(res.data.previous ? paginaDisponiveis - 1 : null)
        } catch (erro) {
            console.error(erro)
        } finally {
            setCarregandoGeral(false)
            setCarregandoDisponiveis(false)
            setCarregandoGrupo(false)
        }
    }

    const validarFormulario = () => {
        let valido = true
        const erro = validarCampoObrigatorio(grupo.name)

        if (erro) valido = false
        setErroNome(erro)
        return valido
    }

    const aoSubmeter = async (evento) => {
        evento.preventDefault()

        if (validarFormulario()) {
            const requisicao = state
                ? GrupoService.editar({id: state, name: grupo.name, addPermissoes, remPermissoes}, state)
                : GrupoService.criar({name: grupo.name, addPermissoes, remPermissoes})

            toast.promise(requisicao, {
                pending: state ? 'Salvando alterações...' : 'Criando grupo...',
                success: {
                    render({ data }) {
                        return data.data.message || 'Erro ao salvar dados'
                    }
                },
                error: {
                    render({ data }) {
                        return data.data.message || 'Erro ao salvar dados'
                    }
                }
            })
        }
    }

    const atualizarPermissoesDoGrupo = (novasPermissoes) => {
        setPermissoesGrupo(prev => {
            const atualizado = typeof novasPermissoes === 'function'
                ? novasPermissoes(prev)
                : novasPermissoes

            return atualizado
        })
    }

    const addPermission = (perm) => {
        setAddPermissoes([...addPermissoes, perm])
        setRemPermissoes(remPermissoes.filter((p) => p.id !== perm.id))
    }

    const removePermission = (perm) => {
        setRemPermissoes([...remPermissoes, perm])
        setAddPermissoes(addPermissoes.filter((p) => p.id !== perm.id))
    }

    useEffect(() => {
        if (state) {
            buscarDadosDoGrupo()
        } else {
            buscarPermissoesDisponiveis()
        }
    }, [state])

    return (
        <FormContainer
            titulo={`${state ? 'Editar' : 'Cadastrar'} Grupo`}
            textoInfo={`Preencha os campos obrigatórios (*)\n\nVincule ou Desvincule permissões ao grupo utilizando as tabelas abaixo.`}
        >
            {carregandoGeral ? (
                <CustomLoading />
            ) : (
                <form className={styles.form} onSubmit={aoSubmeter}>
                    <div className={styles.formGroup}>
                        <Label titulo="Nome *">
                            <Input
                                tipo="text"
                                valor={grupo.name}
                                onBlur={() => setErroNome(validarCampoObrigatorio(grupo.name))}
                                onChange={(e) => setGrupo({ ...grupo, name: e.target.value })}
                                erro={erroNome}
                            />
                        </Label>
                    </div>
                    <TabelaDeTransferencia
                        titulo1="Permissões disponíveis"
                        titulo2="Permissões do grupo"
                        lista1={permissoesDisponiveis}
                        lista2={permissoesGrupo}
                        setLista1={setPermissoesDisponiveis}
                        setLista2={atualizarPermissoesDoGrupo}
                        callbackLista1={(perm) => addPermission(perm)}
                        callbackLista2={(perm) => removePermission(perm)}
                        paginaAtualLista1={paginaDisponiveis}
                        paginaAtualLista2={paginaDoGrupo}
                        proximaPaginaLista1={proximaDisponiveis}
                        proximaPaginaLista2={proximaDoGrupo}
                        paginaAnteriorLista1={anteriorDisponiveis}
                        paginaAnteriorLista2={anteriorDoGrupo}
                        buscarDadosLista1={buscarPermissoesDisponiveis}
                        buscarDadosLista2={buscarPermissoesDoGrupo}
                        carregandoLista1={carregandoDisponiveis}
                        carregandoLista2={carregandoGrupo}
                        setPaginaAtualLista1={setPaginaDisponiveis}
                        setPaginaAtualLista2={setPaginaDoGrupo}
                        obterChave={(p) => p.id}
                        renderizarItem={(p) => p.codename}
                    />
                    <div className={styles.buttonContainer}>
                        <Button texto={state ? "Salvar alterações" : 'Cadastrar'} tipo={'submit'} />
                    </div>
                </form>
            )}
        </FormContainer>
    )
}

export default GrupoForm
