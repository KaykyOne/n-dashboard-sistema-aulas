import { useState } from 'react'
import { getToken } from '@/lib/utils';
import useGeneric from './useGeneric';

export default function useAlunos() {
    const { GenericSearch, loading, error } = useGeneric();

    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const token = getToken();
    if (!token) return;

    async function buscarAlunos(autoescola_id) {
        if (autoescola_id === 0) return;
        const res = await GenericSearch('adm', 'buscarTodosAlunos', `?autoescola_id=${autoescola_id}`);
        setAlunos(res);
    }

    async function getInstrutoresResponsaveis(cpf) {
        if (!cpf) return;
        const res = await GenericSearch('adm', 'buscarInstrutorResponsavel', `?cpf=${cpf}`);
        setInstrutoreResponsavel(res);
    }
    return { buscarAlunos, alunos, loading, getInstrutoresResponsaveis, instrturesResponsaveis }
}
