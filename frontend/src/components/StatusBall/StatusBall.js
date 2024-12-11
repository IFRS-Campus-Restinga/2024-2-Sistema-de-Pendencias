import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSpinner, faCheck, faRocket } from '@fortawesome/free-solid-svg-icons';
import './StatusBalls.css';

const StatusBalls = ({ status, tipo, parecerLancado }) => {
    const [activeStatus, setActiveStatus] = useState('');

    // Atualiza o status quando a prop 'status' mudar
    useEffect(() => {
        setActiveStatus(status);
        console.log(status)
    }, [status]);

    const listaProgresso = [1, 2, 3];

    // Função que retorna a classe 'active' dependendo do índice da bola
    const getStatusClass = (index) => {
        if (activeStatus === 'Finalizada') {
            return 'active';
        }
        if (activeStatus === 'Em Andamento' && index < 2) {
            return 'active';
        }
        if (activeStatus === 'Lançado' && index < 3) {
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
            <div className={`status-ball ${getStatusClass(0)}`}>
                <FontAwesomeIcon icon={faBook} style={{ fontSize: "20px" }} />
                <div className="status-text">Criada</div>
            </div>
            <div className='containerProgresso'>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(1) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 2: Em andamento */}
            <div className={`status-ball ${getStatusClass(1)}`}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "20px" }} />
                <div className="status-text">Em andamento</div>
            </div>


            {/* Bola 3: Lançado */}
                <>
                <div className='containerProgresso'>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>
                <div className={`status-ball ${getStatusClass(2)}`}>
                    <FontAwesomeIcon icon={faRocket} style={{ fontSize: "20px" }} />
                    <div className="status-text">Lançado</div>
                </div>
                </>
                <div className='containerProgresso'>
                    <div style={{width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#00b36b' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '17px', height: '17px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#009e55' : 'white', border: '1px solid #ccc'}}/>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusClass(2) ? '#006b3f' : 'white', border: '1px solid #ccc'}}/>
                </div>

            {/* Bola 4: Finalizada */}
            <div className={`status-ball ${getStatusClass(3)}`}>
                <FontAwesomeIcon icon={faCheck} style={{ fontSize: "20px" }} />
                <div className="status-text">Finalizada</div>
            </div>
        </div>
    );
};

export default StatusBalls;
