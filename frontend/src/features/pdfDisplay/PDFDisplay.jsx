import PDFPreview from '../../components/PDFPreview/PDFPreview'
import styles from './PDFDisplay.module.css'


const PDFDisplay = ({arquivo}) => {

    return (
        <section className={styles.section}>
            <div className={styles.pdfContainer}>
                <PDFPreview pdfData={arquivo?.data ?? arquivo} pdfUrl={arquivo?.image_url ?? null}/>
            </div>
        </section>
    )
}

export default PDFDisplay