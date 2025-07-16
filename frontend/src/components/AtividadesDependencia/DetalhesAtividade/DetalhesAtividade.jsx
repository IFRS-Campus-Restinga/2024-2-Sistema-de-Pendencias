import FormContainer from "../../FormContainer/FormContainer";
import PDFPreview from "../../PDFPreview/PDFPreview";
import styles from "./DetalhesAtividade.module.css";

const DetalhesAtividade = ({ atividade }) => {
  return (
    <FormContainer titulo={atividade.titulo}>
      <section className={styles.section}>
        <div className={styles.div}>
          <label className={styles.label}>
            Descrição
            <p className={styles.p}>{atividade.descricao}</p>
          </label>
        </div>
        <div className={styles.pdf}>
          <PDFPreview pdfData={atividade.arquivo.data} />
        </div>
      </section>
    </FormContainer>
  );
};

export default DetalhesAtividade;
