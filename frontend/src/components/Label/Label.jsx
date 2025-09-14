import styles from './Label.module.css'

const Label = ({ titulo, children }) => {

    return (
        <label className={styles.label}>
            {titulo}
            {children}
        </label>
    )
}

export default Label

