import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

const Modal = ({ estaAberto, aoFechar, mensagem }) => {
  if (!estaAberto) return null;

  return (
    <div className="overlay-modal">
      <div className="modal">
        <button className="botao-fechar" onClick={aoFechar}>
          &times;
        </button>
        <div className="conteudo-modal">
          <p id='mensagem-modal'>{mensagem}</p>
          <Button text="OK" width="110px" onClick={aoFechar} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
