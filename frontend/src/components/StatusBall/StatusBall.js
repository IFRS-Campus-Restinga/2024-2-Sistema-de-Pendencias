import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import './StatusBalls.css';

const StatusBalls = ({ status }) => {
    const [activeStatus, setActiveStatus] = useState('');

    // Atualiza o status quando a prop 'status' mudar
    useEffect(() => {
        setActiveStatus(status);
    }, [status]);

    // Função que retorna a classe 'active' dependendo do índice da bola
    const getStatusClass = (index) => {
        if (activeStatus === 'Finalizada') {
            return 'active'; // Se a tarefa está finalizada, todas as bolas ficam ativas
        }
        if (activeStatus === 'Em andamento' && index < 2) {
            return 'active'; // Se a tarefa está em andamento, bolas 1 e 2 ficam ativas
        }
        if (activeStatus === 'Criada' && index === 0) {
            return 'active'; // Se a tarefa foi criada, só a bola 1 fica ativa
        }
        return ''; // Caso contrário, nenhuma bola fica ativa
    };

    return (
        <div className="status-container">
            {/* Bola 1: Criada */}
            <div className={`status-ball ${getStatusClass(0)}`}>
                <FontAwesomeIcon icon={faBook} style={{ fontSize: "20px" }} />
                <div className="status-text">Criada</div>
            </div>

            {/* Bola 2: Em andamento */}
            <div className={`status-ball ${getStatusClass(1)}`}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "20px" }} />
                <div className="status-text">Em andamento</div> 
            </div>

            {/* Bola 3: Finalizada */}
            <div className={`status-ball ${getStatusClass(2)}`}>
                <FontAwesomeIcon icon={faCheck} style={{ fontSize: "20px" }} />
                <div className="status-text">Finalizada</div> 
            </div>
        </div>
    );
};

export default StatusBalls;
