import styles from './Loading.module.css'

const Loading = ({ border }) => {

    return (
        <div className={styles.loadingContainer}>
            <div className={border === 'green' ? styles.loadingGreen : styles.loading}>

            </div>
        </div>
    )
}

export default Loading