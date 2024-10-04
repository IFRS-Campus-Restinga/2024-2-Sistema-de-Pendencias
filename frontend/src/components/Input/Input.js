import React, { useState } from 'react';
import './Input.css'; // Para o CSS que vamos criar

const Input = ({ tipo, largura = '200px' }) => {
    const [valor, setValor] = useState('');

    return (
        <div className="input-container" style={{ width: largura }}>
            <input
                type={tipo === 'numero' ? 'number' : 'text'}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite algo..."
                className={tipo === 'numero' ? 'sem-setas' : ''}
            />
        </div>
    );
};

export default Input;
