import { useState, useEffect } from 'react';
import { getToken } from '@/lib/utils';
import useGeneric from './useGeneric';

export default function useFinanceiro() {
    const { GenericDelete, GenericSearch, loading, error } = useGeneric();

    const [transacoes, setTransacoes] = useState([]);
    const [transacoesUsuario, setTransacoesUsuario] = useState([]);
    const [res, setRes] = useState("");

    const criarTransacao = async (transacao) => {
        setError('');
        if (!transacao.cpf || !transacao.valor || !transacao.descricao || !transacao.tipo) { setError("cpf, valor, descição ou tipo estão vazios!"); return; };
        if (transacao.tipo === "tipo") { setError("Selecione o tipo!"); return; }
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/financeiro/inserirTransacao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transacao),
            });

            const resJSON = await res.json();
            if (resJSON && resJSON.usuario_id && resJSON.tipo && resJSON.descricao) {
                setRes("Transação criada com sucesso!");
            } else {
                setError("Algo deu errado ao criar a transação.");
            }

            return;

        } catch (error) {
            setError(`Erro ao criar transacao: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const buscarTransacoes = async (autoescola_id) => {
        const res = await GenericSearch("financeiro", "listarPorAutoescola", `?autoescola_id=${autoescola_id}`);
        setTransacoes(res);
    }

    const buscarTransacaoPorUsuario = async (cpf) => {
        if (cpf.length < 11) {
            setTransacoesUsuario([]);
            return;
        }
        const res = await GenericSearch("financeiro", "listarPorAluno", `?cpf=${cpf}`);
        setTransacoesUsuario(res);
    }

    const excluirTransacao = async (id, autoescola_id, cpf) => {
        const res = await GenericDelete("financeiro", id, 'removerTransacao', 'id');
        console.log(res);
        alert(res);
        await Promise.all([
            buscarTransacaoPorUsuario(cpf),
            buscarTransacoes(autoescola_id)
        ])
    }


    return { transacoes, res, loading, error, transacoesUsuario, criarTransacao, buscarTransacoes, buscarTransacaoPorUsuario, excluirTransacao }
}
