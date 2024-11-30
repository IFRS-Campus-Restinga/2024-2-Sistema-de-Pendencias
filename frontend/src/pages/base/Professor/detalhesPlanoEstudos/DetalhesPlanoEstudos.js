// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { PlanoEstudosService } from "../../../../services/planoEstudosService"; 
// import { PEDService } from "../../../../services/pedService"; 

// import FormContainer from '../../../../components/FormContainer/FormContainer';
// import Button from '../../../../components/Button/Button';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DetalhesPlanoEstudo = () => {
//   const { idUsuario, pedId, modalidade } = useParams(); 
//   const [planoEstudo, setPlanoEstudo] = useState(null);  
//   const [pedVinculada, setPedVinculada] = useState(null);  
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null);  
//   const navigate = useNavigate();  

//   useEffect(() => {
//     // Função para buscar os detalhes do plano de estudos
//     const fetchPlanoEstudo = async () => {
//       try {
//         const response = await PlanoEstudosService.buscarPlanoEstudo(pedId);  // Busca plano de estudos
//         setPlanoEstudo(response);
//       } catch (err) {
//         setError("Erro ao carregar os detalhes do plano de estudos.");
//       }
//     };

//     // Função para buscar a PED vinculada ao plano de estudos
//     const fetchPedVinculada = async () => {
//       try {
//         // Passando false para não retornar os IDs ou omitindo o parâmetro
//         const pedData = await PEDService.porId(pedId, modalidade, false);  // Corrigido para usar PEDService.porId
//         setPedVinculada(pedData.data);  // Armazena os dados da PED vinculada
//         setLoading(false);  // Define que o carregamento foi concluído
//       } catch (err) {
//         setError("Erro ao carregar os dados da PED.");
//         setLoading(false);  // Define que o carregamento foi concluído
//       }
//     };

//     // Chama as funções de busca quando o componente for montado
//     fetchPlanoEstudo();
//     fetchPedVinculada();
//   }, [pedId, modalidade]);  // Dependências: pedId e modalidade, quando mudam, as buscas são refeitas

//   if (loading) return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto as informações não chegam
//   if (error) return <div>{error}</div>;  // Exibe uma mensagem de erro se algo der errado

//   // Função de navegação para editar o plano de estudos
//   const handleEditar = () => {
//     navigate(`/sessao/Professor/${idUsuario}/peds-emi/5/planoEstudos/${pedId}/detalhes`);
//   };

//   return (
//     <FormContainer titulo="Detalhes do Plano de Estudos">
//       {/* Exibe as informações do plano de estudos */}
//       <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
//       <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
//       <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>
//       <p><strong>Criado em:</strong> {planoEstudo?.data_criacao}</p>

//       {/* Renderizando os dados da PED vinculada */}
//       <div>
//         <h3>Dados da PED Vinculada</h3>
//         {pedVinculada ? (
//           <div>
//             <p><strong>Aluno:</strong> {pedVinculada.aluno?.nome}</p> {/* Supondo que o nome do aluno esteja em pedVinculada.aluno.nome */}
//             <p><strong>Professor Pedagógico:</strong> {pedVinculada.professor_ped?.nome}</p> {/* Supondo que o nome do professor esteja em pedVinculada.professor_ped.nome */}
//             <p><strong>Professor Disciplina:</strong> {pedVinculada.professor_disciplina?.nome}</p>
//             <p><strong>Disciplina:</strong> {pedVinculada.disciplina?.nome}</p> {/* Supondo que o nome da disciplina esteja em pedVinculada.disciplina.nome */}
//             <p><strong>Curso:</strong> {pedVinculada.curso?.nome}</p> {/* Supondo que o nome do curso esteja em pedVinculada.curso.nome */}
//             <p><strong>Trimestre Recuperar:</strong> {pedVinculada.trimestre_recuperar}</p>
//             <p><strong>Série Progressão:</strong> {pedVinculada.serie_progressao}</p>
//             <p><strong>Turma Atual:</strong> {pedVinculada.turma_atual?.nome}</p> {/* Supondo que o nome da turma esteja em pedVinculada.turma_atual.nome */}
//             <p><strong>Plano de Atividades:</strong> {pedVinculada.plano_atividades ? <a href={pedVinculada.plano_atividades} target="_blank" rel="noopener noreferrer">Ver Plano de Atividades</a> : 'Não disponível'}</p>
//             <p><strong>Formulário de Encerramento:</strong> {pedVinculada.form_encerramento ? <a href={pedVinculada.form_encerramento} target="_blank" rel="noopener noreferrer">Ver Formulário</a> : 'Não disponível'}</p>
//           </div>
//         ) : (
//           <p>Dados da PED não encontrados.</p>
//         )}
//       </div>

//       {/* Botão para editar o plano de estudos */}
//       <Button text="Editar Plano" onClick={handleEditar} />
//       <ToastContainer />
//     </FormContainer>
//   );
// };

// export default DetalhesPlanoEstudo;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlanoEstudosService } from "../../../../services/planoEstudosService"; 
import { PEDService } from "../../../../services/pedService"; 
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Button from '../../../../components/Button/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetalhesPlanoEstudo = () => {
  // Extrai os parâmetros da URL
  const { idUsuario, pedId, modalidade } = useParams(); 
  
  // Estado para armazenar os detalhes do plano de estudo
  const [planoEstudo, setPlanoEstudo] = useState(null);  
  // Estado para armazenar o plano de estudo vinculado (PED)
  const [pedVinculada, setPedVinculada] = useState(null);  
  const [loading, setLoading] = useState(true); // Controle de carregamento
  const [error, setError] = useState(null);  // Controle de erro

  const navigate = useNavigate();  // Hook para navegação entre páginas

  // useEffect para buscar os dados do plano de estudo e o PED vinculado
  useEffect(() => {
    const fetchPlanoEstudo = async () => {
      try {
        const response = await PlanoEstudosService.buscarPlanoEstudo(pedId); // Busca o plano de estudos
        setPlanoEstudo(response); // Armazena os dados recebidos
      } catch (err) {
        setError("Erro ao carregar os detalhes do plano de estudos.");
      }
    };

    const fetchPedVinculada = async () => {
      try {
        const pedData = await PEDService.porId(pedId, modalidade, false); // Busca a PED vinculada
        setPedVinculada(pedData.data); // Armazena os dados do PED
        setLoading(false); // Marca como carregamento concluído
      } catch (err) {
        setError("Erro ao carregar os dados da PED.");
        setLoading(false);
      }
    };

    fetchPlanoEstudo(); // Chama a função para buscar o plano de estudos
    fetchPedVinculada(); // Chama a função para buscar a PED vinculada
  }, [pedId, modalidade]);

  // Se estiver carregando, mostra uma mensagem de loading
  if (loading) return <div>Carregando...</div>;

  // Se ocorreu algum erro, exibe a mensagem de erro
  if (error) return <div>{error}</div>;

  // Função para redirecionar para a tela de edição do plano de estudos
  const handleEditar = () => {
    navigate(`/sessao/Professor/${idUsuario}/planoEstudos/${pedId}/editar`, {
      state: { isEditing: true }, // Passa o estado para indicar que está editando
    });
  };

  return (
    <FormContainer titulo="Detalhes do Plano de Estudos">
      {/* Exibição dos dados do plano de estudos */}
      <p><strong>Forma de Oferta:</strong> {planoEstudo?.forma_oferta}</p>
      <p><strong>Turno:</strong> {planoEstudo?.turno}</p>
      <p><strong>Parecer Pedagógico:</strong> {planoEstudo?.parecer_pedagogico}</p>
      <p><strong>Criado em:</strong> {planoEstudo?.data_criacao}</p>

      {/* Exibição dos dados do PED vinculado (se necessário) */}
      {pedVinculada && (
        <div>
          <h4>Plano de Estudo Vinculado:</h4>
          <p><strong>Nome do PED:</strong> {pedVinculada.nome}</p>
          <p><strong>Status:</strong> {pedVinculada.status}</p>
          {/* Outros detalhes do PED, se necessário */}
        </div>
      )}

      {/* Botão para editar o plano de estudos */}
      <Button text="Editar Plano" onClick={handleEditar} />
      
      <ToastContainer /> {/* Exibe as mensagens de toast, se houver */}
    </FormContainer>
  );
};

export default DetalhesPlanoEstudo;

