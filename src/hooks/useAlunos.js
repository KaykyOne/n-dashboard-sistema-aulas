import { useState } from 'react'
import useGeneric from './useGeneric';
import useFinanceiro from './useFinanceiro';
import { toast } from "react-toastify";

export default function useAlunos() {
    const { GenericSearch, GenericCreate, loading, error } = useGeneric();
    const { criarTransacao } = useFinanceiro();

    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);
    const [alunos, setAlunos] = useState([]);

    const buscarAlunos = async (autoescola_id) => {
        if (autoescola_id === 0) return;
        const res = await GenericSearch('adm', 'buscarTodosAlunos', `?autoescola_id=${autoescola_id}`);
        setAlunos(res); 
    }

    const getInstrutoresResponsaveis = async (cpf) => {
        if (!cpf) return;
        const res = await GenericSearch('adm', 'buscarInstrutorResponsavel', `?cpf=${cpf}`);
        console.log(res);
        setInstrutoreResponsavel(res);
    }

    const inserirAluno = async (aluno, transacao) => {
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
    }

    return { buscarAlunos, alunos, loading, getInstrutoresResponsaveis, inserirAluno, instrturesResponsaveis }
}
