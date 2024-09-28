import React from 'react';
import './Button.css';

const Button = ({ width, color, text, onClick }) => {
  const buttonStyle = {
    width: width || '211px',
    backgroundColor: color || '#28A745'
  };

  return (
    <button className="custom-button" style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;