import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormContainer from "../../../../components/FormContainer/FormContainer";
import Button from "../../../../components/Button/Button";
import Input from '../../../../components/Input/Input';
import Switch from "../../../../components/Switch/Switch";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import conselhoDeClasseService from '../../../../services/conselhoDeClasseService';

const CadastrarConselhoDeClasse = () => {
    const formRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location || {};
    const [formData, setFormData] = useState({
        data_reuniao: '',
        horario: '',
        total_alunos: '',
        alunos_aprovados: '',
        alunos_reprovados: '',
        alunos_pendencia: '',
        alunos_ppt: '',
        observacoes: '',
        ata: '',
        calendarioAcademico: '',
        turma: '',
        dependencia: '',
    });

    const [controleInputs, setControleInputs] = useState({
        data_reuniao: '',
        horario: '',
        total_alunos: '',
        alunos_aprovados: '',
        alunos_reprovados: '',
        alunos_pendencia: '',
        alunos_ppt: '',
        observacoes: '',
        ata: '',
        calendarioAcademico: '',
        turma: '',
        dependencia: '',
    });

    const [errors, setErrors] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (state) {
            setFormData(state);
        }
    }, [state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = state
                ? await conselhoDeClasseService.editarConselhoDeClasse(state.id, formData)
                : await conselhoDeClasseService.criarConselhoDeClasse(formData);

            if (response.status !== 200 && response.status !== 201) {
                const errorMessage = response.data?.message || 'Erro desconhecido';
                throw new Error(errorMessage);
            }

            // Resetar o estado do formulário para valores iniciais
            setFormData({
                data_reuniao: '',
                horario: '',
                total_alunos: '',
                alunos_aprovados: '',
                alunos_reprovados: '',
                alunos_pendencia: '',
                alunos_ppt: '',
                observacoes: '',
                ata: '',
            });

            // Resetar erros e mensagens de erro
            setErrors({});
            setShowErrorMessage(false);

            toast.success(state ? "Conselho de Classe editado com sucesso!" : "Conselho de Classe cadastrado com sucesso!", {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#28A745', color: '#fff', textAlign: 'center' },
                progressStyle: { backgroundColor: '#fff' }
            });


        } catch (erro) {
            toast.error(erro.message, {
                position: "bottom-center",
                autoClose: 3000,
                style: { backgroundColor: '#d11c28', color: '#fff', textAlign: 'center' },
                progressStyle: { backgroundColor: '#fff' }
            });
            console.error('Erro ao cadastrar ou editar Conselho de Classe!', erro);
        }

    };


    const fetchConselhoDeClasse = async () => {
        try {
            const res = await conselhoDeClasseService.porId(state.id)

            if (res.status !== 200) throw new Error(res)

            setFormData(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (state) fetchConselhoDeClasse()
    }, [state])

    return (
        <>
            <ToastContainer />
            <FormContainer onSubmit={handleSubmit} titulo={state ? 'Editar Conselho de Classe' : 'Cadastrar Conselho de Classe'} comprimento='70%' ref={formRef}>
                {showErrorMessage && <p className="error">* Preencha os campos obrigatórios</p>}

                <div className="input-group">
                    <label htmlFor="data_reuniao" className="labelCadastroCurso">Data da Reunião</label>
                    <Input
                        tipo="text"
                        valor={formData.data_reuniao}
                        erro={errors.data_reuniao}
                        onChange={(e) => setFormData({ ...formData, data_reuniao: e.target.value })}
                        textoAjuda='Data da Reunião'
                    />
                    {errors.data_reuniao && <p className="error">{errors.data_reuniao}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="horario" className="labelCadastroCurso">Horário da Reunião</label>
                    <Input
                        tipo="text"
                        valor={formData.horario}
                        erro={errors.horario}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="horario" className="labelCadastroCurso">Horário da Reunião</label>
                    <Input
                        tipo="text"
                        valor={formData.horario}
                        erro={errors.horario}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="total_alunos" className="labelCadastroCurso">Total de Alunos</label>
                    <Input
                        tipo="text"
                        valor={formData.total_alunos}
                        erro={errors.total_alunos}
                        onChange={(e) => setFormData({ ...formData, total_alunos: e.target.value })}
                        textoAjuda='Total de Alunos'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="alunos_aprovados" className="labelCadastroCurso">Quantidade de Alunos Aprovados</label>
                    <Input
                        tipo="text"
                        valor={formData.alunos_aprovados}
                        erro={errors.alunos_aprovados}
                        onChange={(e) => setFormData({ ...formData, alunos_aprovados: e.target.value })}
                    //textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="alunos_reprovados" className="labelCadastroCurso">Quantidade de Alunos Reprovados</label>
                    <Input
                        tipo="text"
                        valor={formData.alunos_reprovados}
                        erro={errors.alunos_reprovados}
                        onChange={(e) => setFormData({ ...formData, alunos_reprovados: e.target.value })}
                    //textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="alunos_pendencia" className="labelCadastroCurso">Quantidade de Alunos com Pendências</label>
                    <Input
                        tipo="text"
                        valor={formData.alunos_pendencia}
                        erro={errors.alunos_pendencia}
                        onChange={(e) => setFormData({ ...formData, alunos_pendencia: e.target.value })}
                    //textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="alunos_ppt" className="labelCadastroCurso">Quantidade de Alunos com PPT</label>
                    <Input
                        tipo="text"
                        valor={formData.alunos_ppt}
                        erro={errors.alunos_ppt}
                        onChange={(e) => setFormData({ ...formData, alunos_ppt: e.target.value })}
                    //textoAjuda='Horário da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="observacoes" className="labelCadastroCurso">Observações</label>
                    <Input
                        tipo="text"
                        valor={formData.observacoes}
                        erro={errors.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        textoAjuda='Informe as Observações da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="ata" className="labelCadastroCurso">Ata</label>
                    <Input
                        tipo="text"
                        valor={formData.ata}
                        erro={errors.ata}
                        onChange={(e) => setFormData({ ...formData, ata: e.target.value })}
                    textoAjuda='Informe a Ata da Reunião'
                    />
                    {errors.horario && <p className="error">{errors.horario}</p>}
                </div>

                <Button tipo='submit' text={state ? 'Salvar Alterações' : 'Cadastrar Conselho de Classe'} />
            </FormContainer>
        </>
    );
};

export default CadastrarConselhoDeClasse;
