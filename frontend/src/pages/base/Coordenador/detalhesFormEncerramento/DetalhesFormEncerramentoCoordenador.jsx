import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import PDFDisplay from "../../../../features/pdfDisplay/PDFDisplay"
import { FormEncerramentoService } from "../../../../services/formEncerramentoService"
import { useLocation } from 'react-router-dom'
import CustomLoading from "../../../../components/customLoading/CustomLoading"
import { AxiosError } from "axios"

const DetalhesFormEncerramentoCoordenador = () =>{
    const location = useLocation()
    const { state } = location
    const modalidade = location.pathname.split('/')[4]
    const [arquivo, setArquivo] = useState(null)
    const [carregando, setCarregando] = useState(true)

    const fetchFormEncerramento = async () => {
        try {
            const res = await FormEncerramentoService.buscar(state.form_encerramento, modalidade, 'id, drive_id')

            setArquivo(res.data.form)
        } catch (error) {
            if (error instanceof AxiosError){
                console.error(error.response?.data.message)
            } else{
                console.error(error)
            }
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        fetchFormEncerramento()
    }, [])

    return (
        <FormContainer 
            titulo={"Formulário de Encerramento"} 
            comprimento={'30%'}
            textoInfo={"Clique no arquivo para visualizá-lo. E após aberto, clique novamente sobre a página ampliada para fazer o download."}
        >
            {
                carregando ? (
                    <CustomLoading/>
                ) : (
                    <PDFDisplay arquivo={arquivo}/>
                )
            }
        </FormContainer>
    )
}

export default DetalhesFormEncerramentoCoordenador