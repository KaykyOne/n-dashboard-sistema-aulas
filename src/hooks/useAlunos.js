"use client"
import { useState } from 'react';
import useGeneric from './useGeneric';
import useFinanceiro from './useFinanceiro';
import { toast } from "react-toastify";

export default function useAlunos() {
    const {
        GenericSearch,
        GenericCreate,
        GenericDeleteRelation,
        GenericUpdate,
        GenericDelete,
        loading,
    } = useGeneric();

    const { criarTransacao } = useFinanceiro();
    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [aulas, setAulas] = useState([])

    const buscarAlunos = async () => {
        const id = sessionStorage.getItem("id_autoescola");
        try {
            if (!id) throw new Error("Autoescola desconhecida!");

            const res = await GenericSearch('adm', 'buscarTodosAlunos', `?autoescola_id=${id}`);

            if (!res || res?.error) {
                throw new Error(res?.error || "Erro desconhecido ao buscar alunos");
            }

            setAlunos(res);
        } catch (erro) {
            toast.error(erro.message || erro.toString());
            setAlunos([]);
        }
    };

    const getInstrutoresResponsaveis = async (cpf) => {
        if (!cpf) {
            setInstrutoreResponsavel([]);
            return;
        }

        try {
            const res = await GenericSearch('adm', 'buscarInstrutorResponsavel', `?cpf=${cpf}`);

            if (!res || res?.error) {
                throw new Error(res?.error || "Erro ao buscar instrutores responsáveis");
            }

            setInstrutoreResponsavel(res);
        } catch (erro) {
            toast.error(erro.message || erro.toString());
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
                throw new Error(resJSON?.error || "Erro ao cadastrar aluno");
            }
        } catch (erro) {
            toast.error(erro.message || erro.toString());
        }
    };

    const editarAluno = async (aluno) => {
        const id = sessionStorage.getItem("id_autoescola");
        aluno.autoescola_id = id;

        try {
            const response = await GenericUpdate("adm", "attaluno", aluno);

            if (response.message === "Aluno atualizado com sucesso!") {
                toast.success("Aluno editado com sucesso!");
                await buscarAlunos();
            } else {
                throw new Error(response.message || "Erro ao editar aluno");
            }
        } catch (erro) {
            toast.error(`Erro ao editar aluno: ${erro.message || erro.toString()}`);
        }
    };

    const excluirAlunoInstrutor = async (cpf, id_instrutor) => {
        try {
            const res = await GenericDeleteRelation("adm", "removerAlunoInstrutor", "cpf", "id_instrutor", cpf, id_instrutor);

            if (res === 'Relacao excluida com sucesso!') {
                toast.success(res);
            } else {
                throw new Error(res?.error || "Erro ao remover relação");
            }
        } catch (erro) {
            toast.error(`Erro ao remover relação: ${erro.message || erro.toString()}`);
        } finally {
            await getInstrutoresResponsaveis(cpf);
        }
    };

    const inserirRelacao = async (cpf, id_instrutor) => {
        try {
            const relacao = { cpf, id_instrutor };
            const { resJSON, res } = await GenericCreate("adm", "addRelacao", relacao);

            if (res.status === 200) {
                toast.success("Relação cadastrada com sucesso!");
            } else {
                throw new Error(resJSON?.error || "Erro ao cadastrar relação");
            }
        } catch (erro) {
            toast.error(`Erro ao inserir relação: ${erro.message || erro.toString()}`);
        } finally {
            await getInstrutoresResponsaveis(cpf);
        }
    };

    const alterAtividadeAluno = async (id) => {
        try {
            const aluno = { usuario_id: id };
            const res = await GenericUpdate("adm", "alterarAtividadeAluno", aluno);

            if (res.message === 'Atividade Aluno Alterado com sucesso!') {
                toast.success("Atividade alterada com sucesso!");
                return res;
            } else {
                throw new Error(res?.message || "Erro ao alterar atividade");
            }
        } catch (erro) {
            toast.error(erro.message || erro.toString());
        }
    };

    const limparInstrutores = () => {
        setInstrutoreResponsavel([]);
    };

    const deletarUsuario = async (id_usuario) => {
        try {
            const res = await GenericDelete('adm', id_usuario, 'removerUsuario', 'id');

            if (!res) {
                throw new Error("Erro ao excluir usuário");
            }

            toast.success("Usuário excluído com sucesso!");
        } catch (erro) {
            toast.error(`Erro ao excluir usuário: ${erro.message || erro.toString()}`);
        } finally {
            await buscarAlunos();
        }
    };

    const searchAulas = async (id_usuario) => {
        if (!id_usuario) {
            setAulas([]);
            return;
        }

        try {
            const res = await GenericSearch('aulas', 'buscarAulas', `?id=${id_usuario}`);

            if (!res || res?.error) {
                throw new Error(res?.error || "Erro ao buscar aulas do aluno!");
            }

            setAulas(res);
        } catch (erro) {
            toast.error(erro.message || erro.toString());
            setAulas([]);
        }
    }

    return {
        buscarAlunos,
        alunos,
        loading,
        aulas,
        searchAulas,
        getInstrutoresResponsaveis,
        inserirAluno,
        editarAluno,
        instrturesResponsaveis,
        excluirAlunoInstrutor,
        inserirRelacao,
        alterAtividadeAluno,
        limparInstrutores,
        deletarUsuario,
    };
}
