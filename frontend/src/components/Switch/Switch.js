import React, { useState } from 'react';
import './Switch.css'

const Switch = ({ opcao1, opcao2 }) => {
    const [isToggled, setIsToggled] = useState(false);

    const toggleSwitch = () => {
        setIsToggled(prev => !prev);
    };

    return (
        <div className="containerSwitch" onClick={toggleSwitch}>
            <span className='esquerda'>{opcao1}</span>
            <span className='direita'>{opcao2}</span>
            <span className={`switcher ${isToggled ? 'ligado' : ''}`}></span>
        </div>
    );
};

export default Switch;