import styles from "./PlanoEstudosForm.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import { toast, ToastContainer } from "react-toastify";
import { PlanoEstudosService } from "../../../../services/planoEstudosService";
import Label from "../../../../components/Label/Label";
import Select from "../../../../components/Select/Select";
import MensagemErro from "../../../../components/MensagemErro/MensagemErro";
import PDFPreview from "../../../../components/PDFPreview/PDFPreview";
import CustomLoading from "../../../../components/customLoading/CustomLoading";
import { validarCampoObrigatorio } from "../../../../utils/validacoes";
import { AxiosError } from "axios";
import PDFDisplay from "../../../../features/pdfDisplay/PDFDisplay";

const PlanoEstudosForm = () => {
  const location = useLocation();
  const modalidade = location.pathname.split("/")[4]
  const redirect = useNavigate()
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
      if (error instanceof AxiosError){
          console.error(error.response?.data.message)
      } else{
          console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const submit = async (e) => {
        e.preventDefault()
        setDesabilitado(true)

        if (validarForm()) {
            const promise = state.plano_estudos ?
            PlanoEstudosService.editar(state.plano_estudos, modalidade, formData) :
            PlanoEstudosService.criar(formData, modalidade)
        
            toast.promise(
              promise, 
              {
                  pending: "Salvando plano de estudos...",
                  success: {
                      render({ data }) {
                          return data.data.message
                      },
                  },
                  error: "Erro de validação"
              }
            ).catch((err) => {
                if (err instanceof AxiosError) {
                    const errors = err.response?.data?.message;

                    if (Array.isArray(errors)) {
                        errors.forEach((msg) => toast.error(msg));
                    } else {
                        toast.error(errors);
                    }
                }
            })

          try {
              const res = await promise
              setPlanoFile(res.data.plano)
              redirect(`/session/professor/peds/${modalidade}/$${state.ped}/`, {state: state.ped})
          } catch (error) {
              if (error instanceof AxiosError){
                  console.error(error.response?.data.message)
              } else{
                  console.error(error)
              }
              setDesabilitado(false)
          }
        } else {
          setDesabilitado(false)
        }
  }

  const validarForm = () => {
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

  if (!state) return null
  
  return (
    <FormContainer 
      titulo={"Plano de Estudos"} 
      comprimento={["Lançada", "Finalizada", "Desativada"].includes(state.status) ? '30%' : '60%'}
      textoInfo={"Preencha os campos obrigatórios (*)\n\nProgressões na modalidade EMI não podem ocorrer o turno noturno."}
    >
      <ToastContainer autoClose={2000} position="bottom-right" />
      <section className={styles.section}>
        {
          isLoading ? (
            <CustomLoading/>
          ) : (
            !["Lançada", "Finalizada", "Desativada"].includes(state.status) ? (
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
                  {
                    !["Lançada", "Finalizada", "Desativada"].includes(state.status) ? (
                      <Button disabled={desabilitado} texto={state.plano_estudos ? "Salvar" : "Cadastrar"} tipo={"submit"}/>
                    ) : null
                  }
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
            ) : (
              planoFile ? (
                <PDFDisplay arquivo={planoFile}/>
              ) : null
            )
          )
        }
      </section>
    </FormContainer>
  )
};

export default PlanoEstudosForm;
