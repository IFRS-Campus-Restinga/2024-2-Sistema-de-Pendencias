import React from 'react';
import './Button.css';

const Button = ({ color, text, onClick, tipo, disabled }) => {
  
  return (
    <div className='containerBotao'>
      <button className="custom-button" type={tipo ? tipo : 'button'} style={{backgroundColor: disabled ? '#ccc' : color || '#006b3f' }} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};

export default Button;
