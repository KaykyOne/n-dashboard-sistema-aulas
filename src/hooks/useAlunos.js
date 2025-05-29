"use client"
import { useState, useEffect } from 'react'
import useGeneric from './useGeneric';
import useFinanceiro from './useFinanceiro';
import { toast } from "react-toastify";

export default function useAlunos() {
    const { GenericSearch, GenericCreate, GenericDeleteRelation, GenericUpdate, loading, error } = useGeneric();
    let id
    useEffect(() => {
        id = sessionStorage.getItem("id_autoescola"); 
    })  
    const { criarTransacao } = useFinanceiro();
    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);
    const [alunos, setAlunos] = useState([]);

    const buscarAlunos = async () => {
        if (id === 0) return;
        const res = await GenericSearch('adm', 'buscarTodosAlunos', `?autoescola_id=${id}`);
        setAlunos(res);
    };

    const getInstrutoresResponsaveis = async (cpf) => {
        if (!cpf) return;
        const res = await GenericSearch('adm', 'buscarInstrutorResponsavel', `?cpf=${cpf}`);
        console.log(res);
        setInstrutoreResponsavel(res);
    };

    const inserirAluno = async (aluno, transacao) => {
        aluno.autoescola_id = id;
        const { resJSON, res } = await GenericCreate("adm", "addaluno", aluno);
        console.log(res);
        console.log(resJSON);
        if (res.status === 200) {
            toast.success("Aluno cadastrado com sucesso!");
        } else {
            console.error(error);
            toast.error("Erro ao cadastrar Aluno!");
        }

        await criarTransacao(transacao);
    };

    const excluirAlunoInstrutor = async (cpf, id_instrutor) => {
        const res = await GenericDeleteRelation("adm", "removerAlunoInstrutor", "cpf", "id_instrutor", cpf, id_instrutor);
        console.log(res);
        if (res === 'Relacao excluida com sucesso!') {
            toast.success(res);
        } else {
            console.error(error);
            toast.error(res);
        }

        await getInstrutoresResponsaveis(cpf);
    };

    const inserirRelacao = async (cpf, id_instrutor) => {
        try {
            const relacao = ({
                cpf: cpf,
                id_instrutor: id_instrutor,
            });
            const { resJSON, res } = await GenericCreate("adm", "addRelacao", relacao);

            if (res.status === 200) {
                toast.success("Relação cadastrada com sucesso!");
            } else {
                console.error(error);
                toast.error("Erro ao cadastrar relação!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            await getInstrutoresResponsaveis(cpf);
        }
    };

    const alterAtividadeAluno = async (id) => {
        try {
            const aluno = {
                usuario_id: id,
            };

            const res = await GenericUpdate("adm", "alterarAtividadeAluno", aluno);

            if (res.message == 'Atividade Aluno Alterado com sucesso!') {
                toast.success("Alterado com sucesso!");
                return res;
            } else {
                console.error(resJSON);
                toast.error("Erro ao alterar aluno!");
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado!");
        }
    };

    const limparInstrutores = () => {
        setInstrutoreResponsavel('');
    }

    return {
        buscarAlunos,
        alunos,
        loading,
        getInstrutoresResponsaveis,
        inserirAluno,
        instrturesResponsaveis,
        excluirAlunoInstrutor,
        inserirRelacao,
        alterAtividadeAluno,
        limparInstrutores,
    }
}
