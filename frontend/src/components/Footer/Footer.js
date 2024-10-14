import React from 'react';
import './Footer.css';
import logo from "../../assets/logo-ifrs-colorido.png";
import emec from "../../assets/emec-acesse-ja.png";

const Footer = () => {
    return (
        <footer>
            <img src={logo} alt="Logo Instituto Federal" id="logo" />
            <div className="phrases">
                <p id='ifrs'>Instituto Federal do Rio Grande do Sul – Campus Restinga</p>
                <p>Rua Alberto Hoffmann, 285 | Bairro Restinga | CEP: 91791-508 | Porto Alegre/RS</p>
                <p>Telefone: (51) 3247-8400</p>
            </div>
            <img src={emec} alt="E-mec acesse já" id='emec' />
        </footer>
    );
};

export default Footer;
