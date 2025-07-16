import atividadeService from "../../services/atividadeService";
import Listagem from '../../features/listagem/Listagem'

const AtividadesDependencia = ({ editar, visualizar, fetchAtividades }) => {

  return (
    <Listagem
      titulo={'Atividades'}
      urlCadastro={''}
      fetchDados={fetchAtividades}
    />
  );
};

export default AtividadesDependencia;
