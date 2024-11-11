import React, { useEffect, forwardRef } from 'react';
import './FormContainer.css';

const FormContainer = forwardRef(({ children, onSubmit, titulo, comprimento }, formRef) => {
    return (
        <form className="formContainer" onSubmit={onSubmit} style={{ width: comprimento }} ref={formRef}>
            <span className="tituloForm">{titulo}</span>
            <hr className="linha" />
            {children}
        </form>
    );
});

export default FormContainer;
