import FormContainer from "../../FormContainer/FormContainer"
import PDFPreview from "../../PDFPreview/PDFPreview"
import './DetalhesAtividade.css'


const DetalhesAtividade = ({ atividade }) => {

    return (
        <FormContainer titulo={atividade.titulo}>
            <section className="sectionDetalhesAtividade">
                <div className="divDetalhesAtividade">
                    <label className="labelDetalhesAtividade">
                        Descrição
                        <p className="pDetalhesAtividade">
                            {atividade.descricao}
                        </p>
                    </label>
                </div>
                <div className="pdfDetalhesAtividade">
                    <PDFPreview pdfData={atividade.arquivo.data}/>
                </div>
            </section>
        </FormContainer>
    )
}

export default DetalhesAtividade