import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PPTService } from '../../../../services/emiPptService';
import Button from "../../../../components/Button/Button";
import FormContainer from '../../../../components/FormContainer/FormContainer';
import Input from "../../../../components/Input/Input";
import "./editarPPT.css";

const EditarPPT = () => {
    const { idPpt } = useParams();
    const [detalhesPPT, setDetalhesPPT] = useState({
        aluno: {},
        curso: {},
        turmaOrigem: {},
        turmaProgressao: {},
        disciplina: {},
        professor: {},
        observacoes: '',
    });

    console.log('DETLAHES',detalhesPPT);

    const fetchDetalhes = async () => {
        const res = await PPTService.getById(idPpt);
        if (res.status === 200) {
            setDetalhesPPT(res.data);
        } else {
            console.error("Erro ao buscar os dados da PPT", res);
        }
    };

    useEffect(() => {
        fetchDetalhes();
    }, [idPpt]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetalhesPPT({
            ...detalhesPPT,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PPTService.editar(idPpt, detalhesPPT);
            console.log("PPT atualizada:", response);
        } catch (error) {
            console.error("Erro ao editar PPT", error);
        }
    };

    return (
        <FormContainer comprimento="70%" titulo="Editar PPT" onSubmit={handleSubmit}>
            <div className="detalhe-ppt">
                <strong>Matrícula:</strong>
                <Input
                    type="text"
                    name="matricula"
                    valor={detalhesPPT.aluno?.email?.split('@')[0] || ''}
                    onChange={handleChange}
                    disabled
                />
            </div>
            <div className="detalhe-ppt">
                <strong>Curso:</strong>
                <Input
                    type="text"
                    name="curso"
                    valor={detalhesPPT.curso?.nome || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="detalhe-ppt">
                <strong>Turma:</strong>
                <Input
                    type="text"
                    name="turmaOrigem"
                    valor={detalhesPPT.turmaOrigem?.numero || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="detalhe-ppt">
                <strong>Turma da PPT:</strong>
                <Input
                    type="text"
                    name="turmaProgressao"
                    valor={detalhesPPT.turmaProgressao?.numero || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="detalhe-ppt">
                <strong>Disciplina:</strong>
                <Input
                    type="text"
                    name="disciplina"
                    valor={detalhesPPT.disciplina?.nome || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="detalhe-ppt">
                <strong>Docente responsável:</strong>
                <Input
                    type="text"
                    name="professor"
                    valor={detalhesPPT.professor?.nome || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="detalhe-ppt">
                <strong>Observações:</strong>
                <Input
                    type="textarea"
                    name="observacoes"
                    valor={detalhesPPT.observacoes || ''}
                    onChange={handleChange}
                />
            </div>

            <Button tipo="submit" text="Salvar alterações" />
        </FormContainer>
    );
};

export default EditarPPT;
