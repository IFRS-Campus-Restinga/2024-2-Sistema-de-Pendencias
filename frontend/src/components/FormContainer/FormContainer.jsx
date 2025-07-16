import { useEffect, forwardRef, useState } from 'react';
import styles from './FormContainer.module.css';
import InfoButton from '../InfoButton/InfoButton';

const FormContainer = forwardRef(({ children, onSubmit, titulo, comprimento, encType, textoInfo }, formRef) => {
    const [largura, setLargura] = useState(window.innerWidth);
    const [infoAberto, setInfoAberto] = useState(false)

    const setComprimento = (tela) => {
        if (tela <= 760) {
            return '90%';
        }
        return comprimento;
    };

    useEffect(() => {
        const handleResize = () => {
            setLargura(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <form className={styles.formContainer} onSubmit={onSubmit} style={{ width: setComprimento(largura) }} ref={formRef} encType={encType}>
            <span className={styles.tituloForm}>
                <p>
                    {titulo} 
                </p>
                {
                    textoInfo ? (
                        <InfoButton infos={textoInfo}/>
                    ) : (
                        <></>
                    )
                }
            </span>
            <hr className={styles.linha} />
            {children}
        </form>
    );
});

export default FormContainer;
