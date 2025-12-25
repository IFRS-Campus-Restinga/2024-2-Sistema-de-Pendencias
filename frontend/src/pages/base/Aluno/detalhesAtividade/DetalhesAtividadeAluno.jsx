import FormContainer from '../../../../components/FormContainer/FormContainer'
import styles from './DetalhesAtividadeAluno.module.css'
import Input from '../../../../components/Input/Input'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PDFPreview from '../../../../components/PDFPreview/PDFPreview'
import Label from '../../../../components/Label/Label'
import CustomLoading from '../../../../components/customLoading/CustomLoading'
import AtividadeService from '../../../../services/atividadeService'
import { AxiosError } from 'axios'

const DetalhesAtividadeAluno = () => {
    const location = useLocation()
    const { state } = location
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        arquivo: null,
    })

    const fetchAtividade = async () => {
        try {
            const res = await AtividadeService.porId(state.id, state.modalidade, 'titulo, descricao, arquivo')

            if (res.status !== 200) throw new Error(res)

            setFormData(res.data)
            
            setIsLoading(false)
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
    
    useEffect(() => {
      fetchAtividade()
    }, []);

    if (isLoading) return <CustomLoading/>

    return (
        <FormContainer 
            titulo={"Detalhes da atividade"} 
            comprimento={'60%'}
            textoInfo={"Clique no arquivo da atividade (caso disponível) para visualizá-lo. E após aberto, clique novamente sobre a página ampliada para fazer o download."}
        >            
            <form className={styles.form}>
              {
                isLoading ? (
                  <CustomLoading/>
                ) : (
                  <>
                    <section className={styles.section}>
                        <div className={styles.formGroup}>
                            <Label titulo={'Título'}>
                                <Input
                                    type={'text'}
                                    valor={formData.titulo}
                                    desabilitado={true}
                                />
                            </Label>
                            <Label titulo={'Descrição'}>
                                <textarea
                                    value={formData.descricao}
                                    className={styles.textArea}
                                    disabled={true}
                                />
                            </Label>
                        </div>
                    </section>
                        {
                            formData.arquivo ?  (
                                <section className={styles.section}>
                                    <div className={styles.pdfContainer}>
                                        <PDFPreview pdfData={formData.arquivo?.data ?? formData.arquivo} pdfUrl={formData.arquivo?.image_url ?? null}/>
                                    </div>
                                </section>
                            ) : <></>
                        }
                  </>
                )
              }
            </form>
        </FormContainer>
    )
}

export default DetalhesAtividadeAluno
