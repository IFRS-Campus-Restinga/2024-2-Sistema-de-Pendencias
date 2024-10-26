import React from 'react';
import './Button.css';

const Button = ({ color, text, onClick, tipo }) => {
  const buttonStyle = {
    width: 'fit-content',
    backgroundColor: color || '#006b3f'
  };

  return (
    <div className='containerBotao'>
      <button className="custom-button" type={tipo ? tipo : 'button'} style={buttonStyle} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
