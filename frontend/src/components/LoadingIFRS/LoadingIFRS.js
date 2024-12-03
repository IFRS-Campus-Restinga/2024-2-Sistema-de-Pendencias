import './LoadingIFRS.css';

const LoadingIFRS = ({icone}) => {
    return (
        <div className="loadingContainer">
            <div className="flipCard">
                <div className="flipCardInner">
                    {/* Frente */}
                    <div className="flipCardFront">
                        <img
                            src="https://ifrs.edu.br/wp-content/themes/ifrs-portal-theme/favicons/apple-touch-icon.png"
                            alt="Logo IFRS"
                            className='frente'
                        />
                    </div>
                    {/* Verso */}
                    <div className="flipCardBack">
                        <img
                            src={icone}
                            alt="Ícone de carregamento"
                            className='verso'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingIFRS;
