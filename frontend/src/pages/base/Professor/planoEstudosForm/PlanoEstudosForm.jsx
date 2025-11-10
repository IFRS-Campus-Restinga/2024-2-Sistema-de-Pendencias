import styles from "./PlanoEstudosForm.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { toast } from "react-toastify";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import Label from "../../../../components/Label/Label";
import Select from "../../../../components/Select/Select";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";
import PDFPreview from "../../../../components/PDFPreview/PDFPreview";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import { validarCampoObrigatorio } from "../../../../utils/validacoes";

const PlanoEstudosForm = () => {
  const location = useLocation();
  const modalidade = location.pathname.split("/")[4]
  const { state } = location || {}; // Verifica se estamos editando ou criando
  const [erros, setErros] = useState({});
  const [desabilitado, setDesabilitado] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [planoFile, setPlanoFile] = useState('')
  const [formData, setFormData] = useState({
    forma_oferta: "",
    turno: "",
    parecer_pedagogico: "",
    ped: state.ped
  });

  const fetchPlanoEstudos = async () => {
    try {
      const res = await PlanoEstudosService.buscar(state.plano_estudos, 'turno, forma_oferta, parecer_pedagogico', modalidade)

      setFormData({
        turno: res.data.turno,
        forma_oferta: res.data.forma_oferta,
        parecer_pedagogico: res.data.parecer_pedagogico,
        ped: state.ped
      })

      setPlanoFile(res.data.plano)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setDesabilitado(true)
    
    if (validar()) {
      const promise = state.plano_estudos
        ? PlanoEstudosService.editar(state.plano_estudos, modalidade, formData)
        : PlanoEstudosService.criar(formData, modalidade)
  
      toast.promise(promise, {
        pending: "Registrando Plano de Estudos...",
        success: {
          render({ data }) {
            return data.data.message
          },
        },
        error: {
          render({ data }) {
            const response = data?.response?.data
            if (response?.errors && Array.isArray(response.errors)) {
              response.errors.forEach(msg => toast.error(msg))
            }
            return response?.message ?? "Ocorreu um erro ao registrar."
          },
        },
      })

      try {
        const res = await promise
        setPlanoFile(res.data.plano)
      } catch (err) {
        console.error("Erro ao registrar plano:", err)
        setDesabilitado(false)
      }
    } else {
      setDesabilitado(false)
    }
  }

  const validar = () => {
    let novosErros = {
      forma_oferta: null,
      turno: null,
      parecer_pedagogico: null
    }

    setDesabilitado(true)

    for (let campo in formData) {
      switch (campo) {
        case 'forma_oferta':
          novosErros.forma_oferta = validarCampoObrigatorio(formData.forma_oferta)
          break;
        case 'turno':
          novosErros.turno = modalidade === "Integrado" && formData.turno === "Noite" ? "PEDs do integrado não podem ocorrer no turno noturno" : null
          break;
        case 'parecer_pedagogico':
          novosErros.parecer_pedagogico = formData.parecer_pedagogico.length < 100 ? "Parecer deve possuir ao menos 100 caracteres" : null
          break;
        default:
          break;
      }
    }

    setErros(novosErros)
    return Object.values(novosErros).every((erro) => erro === null)
  }

  useEffect(() => {
    if (state.plano_estudos) {
      fetchPlanoEstudos()
    } else {
      setIsLoading(false)
    }
  }, [])
  
  return (
    <FormContainer titulo={state.plano_estudos ? "Editar Plano de Estudos" : "Cadastro Plano de Estudos"} comprimento={"60%"}>
      <section className={styles.section}>
        {
          isLoading ? (
            <CustomLoading/>
          ) : (
            <>
              <form className={styles.form} onSubmit={submit}>
                <div className={styles.formGroup}>
                  <Label titulo={'Forma de oferta *'}>
                    <Select
                      opcoes={[
                        {
                          valor: "Presencial"
                        },
                        {
                          valor: "EAD"
                        },
                        {
                          valor: "Híbrido"
                        },
                      ]}
                      chave={'valor'}
                      desabilitado={desabilitado}
                      erro={erros.forma_oferta}
                      selecionado={formData.forma_oferta}
                      setValor={(opcao) => {
                        setFormData({...formData, forma_oferta: opcao.valor})
                      }}
                    />
                  </Label>
                  <Label titulo={'Turno *'}>
                    <Select
                      opcoes={[
                        {
                          valor: "Manhã"
                        },
                        {
                          valor: "Tarde"
                        },
                        {
                          valor: "Noite"
                        },
                        {
                          valor:"Integral"
                        }
                      ]}
                      chave={'valor'}
                      desabilitado={desabilitado}
                      erro={erros.turno}
                      selecionado={formData.turno}
                      setValor={(opcao) => {
                        setFormData({...formData, turno: opcao.valor})
                      }}
                    />
                  </Label>
                </div>
                <div className={styles.formGroup}>
                  <Label titulo={"Parecer pedagógico *"}>
                    <textarea 
                      className={styles.textArea}
                      value={formData.parecer_pedagogico}
                      onChange={(e) => setFormData({...formData, parecer_pedagogico: e.target.value})}
                    />
                    {erros.parecer_pedagogico ? <MensagemErro mensagem={erros.parecer_pedagogico}/> : null}
                  </Label>
                </div>
                <Button disabled={desabilitado} texto={state.plano_estudos ? "Salvar" : "Cadastrar"} tipo={"submit"}/>
              </form>
              {
                planoFile ? (
                  <div className={styles.pdfContainer}>
                    <PDFPreview
                      pdfData={planoFile}
                      width={'120px'}
                      height={'150px'}
                    />
                    <p className={styles.p}>Clique para visualizar o PDF gerado</p>
                  </div>
                ) : null
              }
            </>
          )
        }
      </section>
    </FormContainer>
  )
};

export default PlanoEstudosForm;
