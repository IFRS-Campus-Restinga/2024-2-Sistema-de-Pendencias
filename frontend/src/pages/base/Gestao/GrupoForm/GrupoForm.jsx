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
    const [grupo, setGrupo] = useState({
        id: '',
        name: '',
        permissions: []
    })

    const [carregandoGeral, setCarregandoGeral] = useState(true)
    const [carregandoDisponiveis, setCarregandoDisponiveis] = useState(true)
    const [carregandoGrupo, setCarregandoGrupo] = useState(true)

    const [erroNome, setErroNome] = useState(null)

    const buscarDadosDoGrupo = async () => {
        try {
            const [resGrupo, resDisponiveis, resDoGrupo] = await Promise.all([
                GrupoService.detalhes(state),
                PermissaoService.naoVinculadas(state, paginaDisponiveis),
                PermissaoService.listarPorGrupo(state, paginaDoGrupo)
            ])

            setPermissoesDisponiveis(resDisponiveis.data.results)

            setGrupo(prev => ({
                id: resGrupo.data.id,
                name: resGrupo.data.name,
                permissions: [...prev.permissions, ...resDoGrupo.data.results.flat()]
            }))

            setProximaDisponiveis(resDisponiveis.data.next ? paginaDisponiveis + 1 : null)
            setAnteriorDisponiveis(resDisponiveis.data.prev ? paginaDisponiveis - 1 : null)

            setProximaDoGrupo(resDoGrupo.data.next ? paginaDoGrupo + 1 : null)
            setAnteriorDoGrupo(resDoGrupo.data.prev ? paginaDoGrupo - 1 : null)
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

            setGrupo(prev => ({
                ...prev,
                permissions: [...prev.permissions, ...res.data.results]
            }))

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
            const res = await PermissaoService.listar(paginaDisponiveis)

            setPermissoesDisponiveis(prev => [...prev, ...res.data.results])

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
                ? GrupoService.editar({id: state, name: grupo.name, permissions: permissoesDisponiveis}, state)
                : GrupoService.criar(grupo)

            toast.promise(requisicao, {
                pending: state ? 'Salvando alterações...' : 'Criando grupo...',
                success: state ? 'Grupo atualizado com sucesso!' : 'Grupo criado com sucesso!',
                error: {
                    render({ data }) {
                        return data?.message || 'Erro ao salvar dados'
                    }
                }
            })
        }
    }

    const atualizarPermissoesDoGrupo = (novasPermissoes) => {
        setGrupo(prev => {
            const atualizado = typeof novasPermissoes === 'function'
                ? novasPermissoes(prev.permissions)
                : novasPermissoes

            return {
                ...prev,
                permissions: atualizado
            }
        })
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
            <ToastContainer />
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
                        lista2={grupo.permissions}
                        setLista1={setPermissoesDisponiveis}
                        setLista2={atualizarPermissoesDoGrupo}
                        paginaAtualLista1={paginaDisponiveis}
                        paginaAtualLista2={paginaDoGrupo}
                        temProximaPaginaLista1={proximaDisponiveis}
                        temProximaPaginaLista2={proximaDoGrupo}
                        temPaginaAnteriorLista1={anteriorDisponiveis}
                        temPaginaAnteriorLista2={anteriorDoGrupo}
                        buscarDadosLista1={buscarPermissoesDisponiveis}
                        buscarDadosLista2={buscarPermissoesDoGrupo}
                        carregandoLista1={carregandoDisponiveis}
                        carregandoLista2={carregandoGrupo}
                        setPaginaAtualLista1={setPaginaDisponiveis}
                        setPaginaAtualLista2={setPaginaDoGrupo}
                        obterChave={(p) => p.id}
                        renderizarItem={(p) => p.name}
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
