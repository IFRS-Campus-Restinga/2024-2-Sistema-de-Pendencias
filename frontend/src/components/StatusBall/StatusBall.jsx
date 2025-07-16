import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSpinner, faCheck, faRocket } from '@fortawesome/free-solid-svg-icons';
import styles from './StatusBalls.module.css';

const StatusBalls = ({ status, tipo, parecerLancado }) => {
    const [activeStatus, setActiveStatus] = useState('');

    // Atualiza o status quando a prop 'status' mudar
    useEffect(() => {
        setActiveStatus(status);
    }, [status]);

    // Função que retorna a classe 'active' dependendo do índice da bola
    const getStatusClass = (index) => {
        if (activeStatus === 'Finalizada') {
            return 'active';
        }
        if (activeStatus === 'Lançado' && index < 3) {
            return 'active';
        }
        if (activeStatus === 'Em Andamento' && index < 2) {
            return 'active';
        }
        if (activeStatus === 'Criada' && index === 0) {
            return 'active';
        }
        return '';
    };

    return (
        <div className="status-container">
            {/* Bola 1: Criada */}
            <div className={`${styles.statusBall} ${getStatusClass(0)}`}>
                <FontAwesomeIcon icon={faBook} style={{ fontSize: "20px" }} />
                <div className={styles.statusText}>Criada</div>
            </div>
            <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 2: Em andamento */}
            <div className={`${styles.statusBall} ${getStatusClass(1)}`}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "20px" }} />
                <div className={styles.statusText}>Em andamento</div>
            </div>


            {/* Bola 3: Lançado */}
                <>
                <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>
                <div className={`${styles.statusBall} ${getStatusClass(2)}`}>
                    <FontAwesomeIcon icon={faRocket} style={{ fontSize: "20px" }} />
                    <div className={styles.statusText}>Lançado</div>
                </div>
                </>
                <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 4: Finalizada */}
            <div className={`${styles.statusBall} ${getStatusClass(3)}`}>
                <FontAwesomeIcon icon={faCheck} style={{ fontSize: "20px" }} />
                <div className={styles.statusText}>Finalizada</div>
            </div>
        </div>
    );
};

export default StatusBalls;
