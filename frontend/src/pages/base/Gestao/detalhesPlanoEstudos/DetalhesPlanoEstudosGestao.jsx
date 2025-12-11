import { useEffect, useState } from "react"
import FormContainer from "../../../../components/FormContainer/FormContainer"
import PDFDisplay from "../../../../features/pdfDisplay/PDFDisplay"
import { useLocation } from 'react-router-dom'
import CustomLoading from "../../../../components/customLoading/CustomLoading"
import { PlanoEstudosService } from "../../../../services/planoEstudosService"

const DetalhesPlanoEstudosGestao = () =>{
    const location = useLocation()
    const { state } = location
    const modalidade = location.pathname.split('/')[4]
    const [arquivo, setArquivo] = useState(null)
    const [carregando, setCarregando] = useState(true)

    const fetchPlanoEstudos = async () => {
        try {
            const res = await PlanoEstudosService.buscar(state.plano_estudos, 'id, drive_id', modalidade)

            setArquivo(res.data.plano)
        } catch (error) {
            console.error(error)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        fetchPlanoEstudos()
    }, [])

    return (
        <FormContainer titulo={"Plano de Estudos"} comprimento={'30%'}>
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

export default DetalhesPlanoEstudosGestao