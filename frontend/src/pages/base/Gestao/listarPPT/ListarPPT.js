import { useEffect, useState } from 'react'
import './ListarPPT.css'
import { PPTService } from '../../../../services/emiPptService'
import FormContainer from '../../../../components/FormContainer/FormContainer'
import Input from '../../../../components/Input/Input'
import Button from '../../../../components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Tabela from '../../../../components/Tabela/Tabela'

const ListarPPT = () => {
    const navegar = useNavigate();
    const [listaPPT, setListaPPT] = useState([]);
    const [dependenciasFiltradas, setDependenciasFiltradas] = useState([]);
    const [formData, setFormData] = useState({
        curso: '',
        disciplina: '',
        status: '',
        aluno: '',
        professor: '',
        turmaOrigem: '',
        turmaProgressao: '',
        situacao: '',
        dataInicio: '',
        dataFim: ''
    });
    const statusFilter = ['Desativado', 'Criada', 'Em Andamento', 'Finalizada']

    const filtrarDependencias = () => {
        console.log(formData);
        const dependenciasFiltradas = listaPPT.filter(ppt =>
            (formData.curso === '' || 
                (ppt.curso && ppt.curso?.toLowerCase().trim().includes(formData.curso.toLowerCase().trim()))) &&
    
            (formData.disciplina === '' || 
                (ppt.disciplina && ppt.disciplina?.toLowerCase().trim().includes(formData.disciplina.toLowerCase().trim()))) &&
    
            (formData.status === '' || 
                (ppt.status && ppt.status?.toLowerCase().trim().includes(formData.status.toLowerCase().trim())))
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

    // Função para abrir detalhes da PPT
    const detalhesPpt = async (id) => {
        try {
            console.log("id:", id);
            navegar(`/sessao/GestaoEscolar/${jwtDecode(sessionStorage.getItem('token')).idUsuario}/detalhesPPT/${id}`);
        } catch (error) {
            console.error('Erro ao abrir detalhes: ', error);
        }
    };

    // Fetch inicial quando o componente for carregado
    useEffect(() => {
        fetchPPT();
    }, []);

    return (
        <>
            <FormContainer titulo='Lista de PPT' comprimento='90%'>
                <section className='sectionListarPPT'>
                    <div className='divListarPPT'>
                        <label className='labelListarPPT'>
                            Buscar Curso
                            <Input
                                tipo='text'
                                onChange={(e) => setFormData(prevData => ({ ...prevData, curso: e.target.value }))}
                                valor={formData.curso}
                            />
                        </label>
                    </div>

                    <div className='divListarPPT'>
                        <label className='labelListarPPT'>
                            Buscar Disciplina
                            <Input
                                tipo='text'
                                onChange={(e) => setFormData(prevData => ({ ...prevData, disciplina: e.target.value }))}
                                valor={formData.disciplina}
                            />
                        </label>
                    </div>

                    <div className='divListarPPT'>
                        <label className='labelListarPPT'>
                            Buscar status
                            <br/>
                            <select className='statusOption' onChange={(e) => setFormData(prevData => ({ ...prevData, status: e.target.value }))}>
                                <option className="statusOption" value=''>Selecione um status</option>
                                {
                                    statusFilter.map((status) => (
                                        <option className="statusOption" value={status}>{status}</option>
                                    ))
                                }
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

                <div className='containerTabelaListarPPT'>
                    <Tabela listaFiltrada={dependenciasFiltradas} fontSize='10px' />
                </div>
            </FormContainer>
        </>
    );
};

export default ListarPPT;
