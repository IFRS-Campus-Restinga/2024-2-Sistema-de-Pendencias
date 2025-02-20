import { useState } from 'react'
import './InfoButton.css'

const InfoButton = ({infos}) => {
    const [infoAberto, setInfoAberto] = useState(false)

    return (
        <div className='infoContainer'>
            <span className="infoCircle" onMouseEnter={() => setInfoAberto(true)} onMouseLeave={() => setInfoAberto(false)}>
                i
            </span>
            <p className={`pInfos ${infoAberto ? 'show' : ''}`}>{infos}</p>
        </div>
    )
}

export default InfoButton