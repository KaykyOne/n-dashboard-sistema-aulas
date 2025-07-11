import { useState } from 'react';
import useGeneric from './useGeneric';
import { toast } from "react-toastify";

export default function useFinanceiro() {
  const { GenericDelete, GenericSearch, GenericCreate, loading } = useGeneric();

  const [transacoes, setTransacoes] = useState([]);
  const [transacoesUsuario, setTransacoesUsuario] = useState([]);
  const [res, setRes] = useState("");

  const criarTransacao = async (transacao) => {
    const id = sessionStorage.getItem("id_autoescola");

    try {
      if (!transacao.cpf || !transacao.valor || !transacao.descricao || !transacao.tipo) {
        throw new Error("Preencha todos os campos obrigatórios: CPF, valor, descrição e tipo!");
      }

      if (transacao.tipo === "tipo") {
        throw new Error("Selecione um tipo válido para a transação!");
      }

      transacao.cpf = transacao.cpf.replace(/[^0-9]/g, '');

      const { resJSON, res } = await GenericCreate("financeiro", "inserirTransacao", transacao);

      if (res.status === 200) {
        setRes("ok");
        toast.success("Transação criada com sucesso!");
      } else if (res.status === 401) {
        toast.error("Usuário inativado ou não existe!");
      } else {
        throw new Error(resJSON?.error || "Erro ao criar transação!");
      }

      await buscarTransacoes(id);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
    }
  };

  const buscarTransacoes = async () => {
    try {
      const id = sessionStorage.getItem("id_autoescola");
      if (!id) throw new Error("Autoescola não identificada!");

      const res = await GenericSearch("financeiro", "listarPorAutoescola", `?autoescola_id=${id}`);
      setTransacoes(res || []);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      setTransacoes([]);
    }
  };

  const buscarTransacaoPorUsuario = async (cpf) => {
    try {
      if (!cpf || cpf.length < 11) {
        setTransacoesUsuario([]);
        return;
      }

      const res = await GenericSearch("financeiro", "listarPorAluno", `?cpf=${cpf}`);
      setTransacoesUsuario(res || []);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      setTransacoesUsuario([]);
    }
  };

  const excluirTransacao = async (id, autoescola_id, cpf) => {
    try {
      const res = await GenericDelete("financeiro", id, 'removerTransacao', 'id');
      if (res?.mensagem || typeof res === "string") {
        toast.success(typeof res === "string" ? res : res.mensagem);
      } else {
        throw new Error(res?.error || "Erro ao excluir transação");
      }

      await Promise.all([
        buscarTransacaoPorUsuario(cpf),
        buscarTransacoes(autoescola_id)
      ]);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
    }
  };

  return {
    transacoes,
    res,
    loading,
    transacoesUsuario,
    criarTransacao,
    buscarTransacoes,
    buscarTransacaoPorUsuario,
    excluirTransacao
  };
}
