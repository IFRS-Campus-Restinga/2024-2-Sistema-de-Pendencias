import styles from './Modal.module.css'
import close from '../../assets/close-svgrepo-com.svg'


const Modal = ({setIsOpen, children}) => {

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <img src={close} alt="" className={styles.close} onClick={() => setIsOpen(false)}/>
                {children}
            </div>
        </section>
    )
}

export default Modal