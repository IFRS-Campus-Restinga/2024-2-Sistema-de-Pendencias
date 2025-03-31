import styles from './Label.module.css'

const Label = ({ titulo, children }) => {

    return (
        <label htmlFor={titulo.toLowerCase()} className={styles.label}>
            {titulo}
            {children}
        </label>
    )
}

export default Label

