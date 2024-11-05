

const Tabela = ({formData, ordenarPor}) => {
    
    const ordenarPorColuna = (coluna) => {
        const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
      
        const linhasOrdenadas = [...servidoresFiltrados].sort((a, b) => {
          let valorA = a[coluna] || '-';  // Valor A ou "-"
          let valorB = b[coluna] || '-';  // Valor B ou "-"
      
          // Tratar a coluna 'perfil' usando o mapeamento específico
          if (coluna === 'perfil') {
            valorA = perfilMap[a.perfil] || '-';
            valorB = perfilMap[b.perfil] || '-';
          }
      
          // Puxar valores preenchidos ("-") para o fim, independente da ordem
          if (valorA === '-' && valorB !== '-') return 1;  // Coloca "-" depois
          if (valorA !== '-' && valorB === '-') return -1; // Coloca preenchidos antes
      
          // Se ambos são preenchidos ou ambos são vazios ("-"), ordenar normalmente
          return valorA < valorB ? (novaOrdem === 'asc' ? -1 : 1) : (valorA > valorB ? (novaOrdem === 'asc' ? 1 : -1) : 0);
        });
      
        setServidoresFiltrados(servidoresOrdenados);
        setOrdenacao({ coluna, ordem: novaOrdem });
      };


    return (
        <table className='tabela'>
        <thead className='cabecalhoTabela'>
          <tr className='trTabela'>
            <th onClick={() => ordenarPorColuna('perfil')}>
              <div className="th-conteudo">
                <img
                  className="icone-ordenar"
                  src={Ordenar}
                  alt="Ordenar"
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                  title="Ordenar"
                  />
                  <p>Perfil</p>
                {ordenacao.coluna === 'perfil' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
                )}
              </div>
            </th>
            <th onClick={() => ordenarPorColuna('nome')}>
              Nome
              {ordenacao.coluna === 'nome' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('cpf')}>
              CPF
              {ordenacao.coluna === 'cpf' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('matricula')}>
              Matrícula
              {ordenacao.coluna === 'matricula' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('email')}>
              Email
              {ordenacao.coluna === 'email' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th onClick={() => ordenarPorColuna('data_ingresso')}>
              Data de Ingresso
              {ordenacao.coluna === 'data_ingresso' && (
                <span className={`seta ${ordenacao.ordem === 'asc' ? 'seta-baixo' : 'seta-cima'}`}></span>
              )}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servidoresFiltrados.map((servidor) => (
            <tr key={`${servidor.id}-${servidor.nome}`}>
              <td>{perfilMap[servidor.perfil] || '-'}</td>
              <td>{servidor.first_name || '-'}</td>
              <td>{servidor.cpf || '-'}</td>
              <td>{servidor.matricula || '-'}</td>
              <td>{servidor.email || '-'}</td>
              <td>{servidor.data_ingresso || '-'}</td>
              <td className='icone-container'>
              <img 
                className='iconeAcoes'
                src={Visualizar} 
                alt="Visualizar" 
                onClick={() => console.log('Visualizar servidor')} 
                title="Visualizar"/>
              <img 
                className='iconeAcoes'
                src={Deletar} 
                alt="Deletar" 
                onClick={() => deletarServidor(servidor.id, servidor.nome)} 
                title="Deletar"/>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
}

export default Tabela