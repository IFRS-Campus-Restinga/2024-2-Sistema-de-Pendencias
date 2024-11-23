import { useEffect, useState } from 'react';
import './ListarPPT.css';
import { PPTService } from '../../../../services/emiPptService';
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Tabela from '../../../../components/Tabela/Tabela';

const ListarPPT = () => {
    const navegar = useNavigate();
    const [listaPPT, setListaPPT] = useState([]);
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState([]);
    const [formData, setFormData] = useState({
        termoBusca: '',
        status: '',
    });
    const statusFilter = ['Desativado', 'Criada', 'Em Andamento', 'Finalizada'];

    const filtrarDependencias = () => {
        console.log(formData);
        const dependenciasFiltradas = listaPPT.filter(ppt =>
            (formData.termoBusca === '' || 
                (ppt.curso && ppt.curso.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.disciplina && ppt.disciplina.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.aluno && ppt.aluno.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.aluno?.email && ppt.aluno.email.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.professor && ppt.professor.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.professor?.email && ppt.professor.email.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.turmaOrigem && ppt.turmaOrigem.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.turmaProgressao && ppt.turmaProgressao.toLowerCase().includes(formData.termoBusca.toLowerCase())) ||
                (ppt.status && ppt.status.toLowerCase().includes(formData.termoBusca.toLowerCase()))
            ) &&
            
            (formData.status === '' || 
                (ppt.status && ppt.status.toLowerCase().includes(formData.status.toLowerCase()))
            )
        );
    
        setDependenciasFiltradas(dependenciasFiltradas);
    };

    const fetchPPT = async () => {
        try {
            const res = await PPTService.list();

            if (res.status !== 200) throw new Error(res.response.data.mensagem);

            setListaPPT(res.data);
            setDependenciasFiltradas(res.data); // Carregar lista completa ao iniciar
        } catch (error) {
            console.error('Erro ao buscar PPTs: ', error);
        }
    };

    const detalhesPpt = async (id) => {
        try {
            console.log("id:", id);
            navegar(`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/detalhesPPT/${id}`);
        } catch (error) {
            console.error('Erro ao abrir detalhes: ', error);
        }
    };

    useEffect(() => {
        fetchPPT();
    }, []);

    return (
        <>
            <FormContainer titulo='Lista de PPT' comprimento='90%'>
                <section className='sectionListarPPT'>
                    <div className='divListarPPT'>
                        <label className='labelListarPPT'>
                            Buscar
                            <Input
                                tipo='text'
                                onChange={(e) => setFormData(prevData => ({ ...prevData, termoBusca: e.target.value }))}
                                valor={formData.termoBusca}
                            />
                        </label>
                    </div>

                    <div className='divListarPPT'>
                        <label className='labelListarPPT'>
                            Buscar Status
                            <select 
                                className='statusOption' 
                                onChange={(e) => setFormData(prevData => ({ ...prevData, status: e.target.value }))}
                                value={formData.status} 
                            >
                                <option value=''>Selecione um status</option>
                                {statusFilter.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </section>

                <span className='containerButton'>
                    <Button
                        text='Buscar'
                        onClick={filtrarDependencias}
                    />
                    <Button
                        text='Limpar Campos'
                        color="#4A4A4A"
                    />
                    <Link to={`/sessao/Gestão Escolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/cadastroPPT`}>
                        <Button
                            text='Adicionar nova'
                        />
                    </Link>
                </span>
                <Tabela listaFiltrada={dependenciasFiltradas} fontSize='10px' />
            </FormContainer>
        </>
    );
};

export default ListarPPT;
