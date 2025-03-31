import React from 'react';
import styles from './Footer.module.css';
import logo from "../../assets/logo-ifrs-colorido.png";
import emec from "../../assets/emec-acesse-ja.png";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <img src={logo} alt="Logo Instituto Federal" className={styles.logoFooter} />
                <div className={styles.conteudo}>
                    <p className={styles.titulo}>Instituto Federal do Rio Grande do Sul – Campus Restinga</p>
                    <p>Rua Alberto Hoffmann, 285 | Bairro Restinga | CEP: 91791-508 | Porto Alegre/RS</p>
                    <p>Telefone: (51) 3247-8400</p>
                </div>
            </div>
            <img src={emec} alt="E-mec acesse já" className={styles.emec} />
        </footer>
    );
};

export default Footer;
