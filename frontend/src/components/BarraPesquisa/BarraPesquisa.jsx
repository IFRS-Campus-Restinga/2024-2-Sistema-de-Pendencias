import styles from './BarraPesquisa.module.css'
import search from '../../assets/search-alt-svgrepo-com-white.svg'
import clear from '../../assets/close-svgrepo-com-white.svg'

const BarraPesquisa = ({ onSearch, setFiltro, filtro }) => {

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            onSearch()
        }
    }

    return (
        <div className={styles.containerBarraPesquisa}>
            <input
                type="text"
                name={'searchInput'}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                onKeyDown={handleEnter}
                className={styles.inputPesquisa}
            />
            <div className={styles.containerAcoes}>
                <img src={search} className={styles.acao} alt="Buscar" onClick={() => onSearch()} />
                <img src={clear} className={styles.acao} alt="Limpar campo" onClick={() => setFiltro('')}/>
            </div>
        </div>
    )
}

export default BarraPesquisa
