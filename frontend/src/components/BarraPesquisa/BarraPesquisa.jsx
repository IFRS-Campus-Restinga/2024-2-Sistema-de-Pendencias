import styles from './BarraPesquisa.module.css'
import search from '../../assets/search-alt-svgrepo-com-white.svg'
import clear from '../../assets/close-svgrepo-com-white.svg'

const BarraPesquisa = ({ onSearch, setSearch, searchParam }) => {

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            onSearch(1, searchParam)
        }
    }

    return (
        <div className={styles.containerBarraPesquisa}>
            <input
                type="text"
                name={'searchInput'}
                value={searchParam}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleEnter}
                className={styles.inputPesquisa}
            />
            <div className={styles.containerAcoes}>
                <img src={search} className={styles.acao} alt="Buscar" onClick={() => onSearch(1 ,searchParam)} />
                <img src={clear} className={styles.acao} alt="Limpar campo" onClick={() => setSearch('')}/>
            </div>
        </div>
    )
}

export default BarraPesquisa
