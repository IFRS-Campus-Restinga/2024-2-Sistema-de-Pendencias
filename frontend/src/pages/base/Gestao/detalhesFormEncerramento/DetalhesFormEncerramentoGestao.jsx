import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import PDFDisplay from "../../../../features/pdfDisplay/PDFDisplay"
import { FormEncerramentoService } from "../../../../services/formEncerramentoService"
import { useLocation } from 'react-router-dom'
import CustomLoading from "../../../../components/customLoading/CustomLoading"

const DetalhesFormEncerramentoGestao = () =>{
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
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        fetchFormEncerramento()
    }, [])

    return (
        <FormContainer titulo={"Formulário de Encerramento"} comprimento={'30%'}>
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

export default DetalhesFormEncerramentoGestao