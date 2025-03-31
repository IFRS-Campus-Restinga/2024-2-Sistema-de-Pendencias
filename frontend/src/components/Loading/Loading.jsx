import styles from './Loading.module.css'

const Loading = ({ border }) => {

    return (
        <div className={border === 'green' ? styles.loadingGreen : styles.loading}>

        </div>
    )
}

export default Loading