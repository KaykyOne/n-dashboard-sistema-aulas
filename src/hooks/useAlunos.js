"use client"
import { useState, useEffect } from 'react'
import useGeneric from './useGeneric';
import useFinanceiro from './useFinanceiro';
import { toast } from "react-toastify";

export default function useAlunos() {
    const { GenericSearch, GenericCreate, GenericDeleteRelation, GenericUpdate, GenericDelete, loading, error } = useGeneric();

    const { criarTransacao } = useFinanceiro();
    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);
    const [alunos, setAlunos] = useState([]);

    const buscarAlunos = async () => {
        const id = sessionStorage.getItem("id_autoescola");
        try {
            if (!id) throw new Error("Autoescola desconhecida!");
            const res = await GenericSearch('adm', 'buscarTodosAlunos', `?autoescola_id=${id}`);
            if (!res || error) {
                throw new Error(error || "Erro desconhecido ao buscar alunos");
            }
            setAlunos(res);
        } catch (error) {
            toast.error(error);
        }
    };

    const getInstrutoresResponsaveis = async (cpf) => {
        if (!cpf) {
            setInstrutoreResponsavel([]);
            return;
        }

        try {
            const res = await GenericSearch('adm', 'buscarInstrutorResponsavel', `?cpf=${cpf}`);
            if (!res || error) {
                throw new Error(error || "Erro desconhecido ao buscar instrutores responsaveis!");
            }
            setInstrutoreResponsavel(res);
        } catch (error) {
            toast.error(error.message);
            setInstrutoreResponsavel([]);
        }
    };

    const inserirAluno = async (aluno, transacao) => {
        const id = sessionStorage.getItem("id_autoescola");
        aluno.autoescola_id = id;
        try {
            if (!id) throw new Error("Autoescola desconhecida!");
            const { resJSON, res } = await GenericCreate("adm", "addaluno", aluno);

            if (res.ok) {
                await criarTransacao(transacao);
                toast.success("Aluno cadastrado com sucesso!");
                await buscarAlunos();
                return resJSON;
            } else {
                toast.error(result?.error || "Erro ao cadastrar Aluno!");
                return resJSON;
            }
        }catch(error){
            toast.error(error);
        }
        
    };

    const editarAluno = async (aluno) => {
        const id = sessionStorage.getItem("id_autoescola");
        aluno.autoescola_id = id;
        console.log(aluno);
        const response = await GenericUpdate("adm", "attaluno", aluno);
        console.log(response);
        if (response.message == "Aluno atualizado com sucesso!") {
            toast.success("Aluno editado com sucesso!");
            await buscarAlunos();
        } else {
            console.error(error);
            toast.error("Erro ao editar Aluno!");
        }
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
    };

    const deletarUsuario = async (id_usuario) => {
        const res = await GenericDelete('adm', id_usuario, 'removerUsuario', 'id');
        toast(res);
        await buscarAlunos();
    }

    return {
        buscarAlunos,
        alunos,
        loading,
        getInstrutoresResponsaveis,
        inserirAluno,
        editarAluno,
        instrturesResponsaveis,
        excluirAlunoInstrutor,
        inserirRelacao,
        alterAtividadeAluno,
        limparInstrutores,
        deletarUsuario,
    }
}
