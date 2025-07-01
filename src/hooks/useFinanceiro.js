import { useState } from 'react';
import useGeneric from './useGeneric';
import { toast } from "react-toastify";

export default function useFinanceiro() {
    const { GenericDelete, GenericSearch, GenericCreate, loading, error } = useGeneric();

    const [transacoes, setTransacoes] = useState([]);
    const [transacoesUsuario, setTransacoesUsuario] = useState([]);
    const [res, setRes] = useState("");

    const criarTransacao = async (transacao) => {
        const id = sessionStorage.getItem("id_autoescola");
        try {
            // Validação básica
            if (!transacao.cpf || !transacao.valor || !transacao.descricao || !transacao.tipo) {
                throw new Error("cpf, valor, descrição ou tipo estão vazios!");
            }
            if (transacao.tipo === "tipo") {
                throw new Error("Selecione o tipo!");
            }
            transacao.cpf = (transacao.cpf).replace(/[^0-9]/g, '');
            // Usa o GenericCreate
            const { resJSON, res } = await GenericCreate("financeiro", "inserirTransacao", transacao);
            console.log(res);
            if (res.status === 200) {
                setRes("ok");
                toast.success("Transação criada com sucesso!");
            } else if (res.status === 401) {
                toast.error("Usuário Inativado ou não existe!");
            } else {
                toast.error("Erro ao criar Transação!");
            }

            await buscarTransacoes(id);
        } catch (error) {

        }

    };
    const buscarTransacoes = async (autoescola_id) => {
        const res = await GenericSearch("financeiro", "listarPorAutoescola", `?autoescola_id=${autoescola_id}`);
        setTransacoes(res);
    };
    const buscarTransacaoPorUsuario = async (cpf) => {
        if (cpf.length < 11) {
            setTransacoesUsuario([]);
            return;
        }
        const res = await GenericSearch("financeiro", "listarPorAluno", `?cpf=${cpf}`);
        setTransacoesUsuario(res);
    };
    const excluirTransacao = async (id, autoescola_id, cpf) => {
        const res = await GenericDelete("financeiro", id, 'removerTransacao', 'id');
        toast.error(res);
        await Promise.all([
            buscarTransacaoPorUsuario(cpf),
            buscarTransacoes(autoescola_id)
        ])
    };


    return { transacoes, res, loading, error, transacoesUsuario, criarTransacao, buscarTransacoes, buscarTransacaoPorUsuario, excluirTransacao }
}
