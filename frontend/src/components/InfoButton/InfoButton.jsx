import { useState } from 'react'
import styles from './InfoButton.module.css'

const InfoButton = ({ infos }) => {
    const [infoAberto, setInfoAberto] = useState(false)

    return (
        <div className={styles.infoContainer}>
            <span className={styles.infoCircle} onMouseEnter={() => setInfoAberto(true)} onMouseLeave={() => setInfoAberto(false)}>
                <p className={styles.i}>i</p>
            </span>
            <p className={`${styles.pInfos} ${infoAberto ? styles.show : null}`}>{infos}</p>
        </div>
    )
}

export default InfoButton