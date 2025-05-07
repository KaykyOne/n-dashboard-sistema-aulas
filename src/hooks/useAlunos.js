import React, { useState, useEffect } from 'react'

export default function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [instrturesResponsaveis, setInstrutoreResponsavel] = useState([]);

    async function buscarAlunos(autoescola_id) {
        if (autoescola_id === 0) return;
        setLoading(true);
        try {
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarTodosAlunos?autoescola_id=${autoescola_id}`);
            let respostaJson = await res.json();
            // console.log(respostaJson);
            setAlunos(respostaJson);
        } catch (error) {
            console.error(`erro ao buscar alunos: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    async function getInstrutoresResponsaveis(cpf) {
        if (!cpf) return;
        setLoading(true);
        try {
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarInstrutorResponsavel?cpf=${cpf}`);
            let respostaJson = await res.json();
            // console.log(respostaJson);
            setInstrutoreResponsavel(respostaJson);
        }
        catch (error) {
            console.error(`erro ao buscar instrutores responsaveis: ${error}`);
        } finally {
            setLoading(false);
        }
    }
    return { buscarAlunos, alunos, loading, getInstrutoresResponsaveis, instrturesResponsaveis }
}
