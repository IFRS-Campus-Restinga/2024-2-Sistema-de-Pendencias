import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSpinner, faCheck, faRocket } from '@fortawesome/free-solid-svg-icons';
import styles from './StatusBalls.module.css';
import hourglass from '../../assets/hourglass-half-bottom-svgrepo-com.svg'
import hourglassWhite from '../../assets/hourglass-half-bottom-svgrepo-com-white.svg'
import rocket from '../../assets/rocket-svgrepo-com.svg'
import rocketWhite from '../../assets/rocket-svgrepo-com-white.svg'
import check from '../../assets/check-svgrepo-com.svg'
import checkWhite from '../../assets/check-svgrepo-com-white.svg'
import book from '../../assets/books-overlapping-arrangement-svgrepo-com.svg'
import bookWhite from '../../assets/books-overlapping-arrangement-svgrepo-com-white.svg'

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
        if (activeStatus === 'Lançada' && index < 3) {
            return 'active';
        }
        if (activeStatus === 'Em Andamento' && index < 2) {
            return 'active';
        }
        if (activeStatus === 'Criada' && index === 0) {
            return 'active';
        }
        return null;
    };

    return (
        <div className={styles.statusContainer}>
            {/* Bola 1: Criada */}
            <div className={`${styles.statusBall} ${getStatusClass(0) ? styles[getStatusClass(0)] : ''}`}>
                <img src={getStatusClass(0) ? bookWhite : book} className={styles.statusIcon} />
                <div className={styles.statusText}>Criada</div>
            </div>
            <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 2: Em andamento */}
            <div className={`${styles.statusBall} ${getStatusClass(1) ? styles[getStatusClass(1)] : ''}`}>
                <img src={getStatusClass(1) ? hourglassWhite : hourglass} className={styles.statusIcon} />
                <div className={styles.statusText}>Em andamento</div>
            </div>


            {/* Bola 3: Lançado */}
                <>
                <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>
                <div className={`${styles.statusBall} ${getStatusClass(2) ? styles[getStatusClass(2)] : ''}`}>
                    <img src={getStatusClass(2) ? rocketWhite : rocket} className={styles.statusIcon} />
                    <div className={styles.statusText}>Lançada</div>
                </div>
                </>
                <div className={styles.containerProgresso}>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(3) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(3) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(3) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 4: Finalizada */}
            <div className={`${styles.statusBall} ${getStatusClass(3) ? styles[getStatusClass(3)] : ''}`}>
                <img src={getStatusClass(3) ? checkWhite : check} className={styles.statusIcon} />
                <div className={styles.statusText}>Finalizada</div>
            </div>
        </div>
    );
};

export default StatusBalls;
