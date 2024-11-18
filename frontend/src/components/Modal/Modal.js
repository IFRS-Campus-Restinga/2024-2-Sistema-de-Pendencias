import React from 'react';
import './Modal.css';
import Button from '../Button/Button';  // Botão reutilizável, como você já tem

const Modal = ({ 
  estaAberto, 
  aoFechar, 
  mensagem, 
  onClick, 
  textoCancelar = 'Cancelar',  // Valor padrão 'Cancelar' caso não seja passado
  textoOk = 'OK',
  colorButton              // Valor padrão 'OK' caso não seja passado
}) => {
  if (!estaAberto) return null;

  return (
    <div className="overlay-modal">
      <div className="modal">
        <button className="botao-fechar" onClick={aoFechar}>
          &times;
        </button>
        <div className="conteudo-modal">
          <p id="mensagem-modal">{mensagem}</p>
          <div className="botoes-modal">
            {/* Botão Cancelar - fecha o modal */}
            <Button text={textoCancelar} width="110px" onClick={aoFechar} />

            {/* Botão OK - chama a função onClick */}
            <Button text={textoOk} width="110px" onClick={onClick} color={colorButton}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
