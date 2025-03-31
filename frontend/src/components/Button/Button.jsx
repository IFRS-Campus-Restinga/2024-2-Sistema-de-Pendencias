import React from 'react';
import styles from './Button.module.css';

const Button = ({ color, text, onClick, tipo, disabled }) => {

  return (
    <div className={styles.containerBotao}>
      <button className={styles.botaoCustom} type={tipo ? tipo : 'button'} style={{ backgroundColor: disabled ? '#ccc' : color || '#006b3f' }} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};

export default Button;
