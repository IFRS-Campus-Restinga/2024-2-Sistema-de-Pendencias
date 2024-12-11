import React, { useEffect, forwardRef, useState } from 'react';
import './FormContainer.css';

const FormContainer = forwardRef(({ children, onSubmit, titulo, comprimento }, formRef) => {
    const [largura, setLargura] = useState(window.innerWidth);

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
        <form className="formContainer" onSubmit={onSubmit} style={{ width: setComprimento(largura) }} ref={formRef}>
            <span className="tituloForm">{titulo}</span>
            <hr className="linha" />
            {children}
        </form>
    );
});

export default FormContainer;
