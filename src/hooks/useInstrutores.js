"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import useGeneric from "./useGeneric";

export default function useInstrutores() {
  const {
    GenericSearch,
    GenericCreate,
    GenericUpdate,
    GenericPath,
    GenericDelete,
    
    loading,
  } = useGeneric();

  const [instrutores, setInstrutores] = useState([]);

  async function buscarInstrutores() {
    const autoescola_id = sessionStorage.getItem("id_autoescola");

    try {
      const res = await GenericSearch("adm", "buscarTodosInstrutores", `?autoescola_id=${autoescola_id}`);
      if (!res) throw new Error("Erro ao buscar instrutores.");
      setInstrutores(res || []);
    } catch (error) {
      toast.error(`Erro ao buscar instrutores: ${error.message || error.toString()}`);
      setInstrutores([]);
    }
  }

  async function cadastrarInstrutor(instrutor) {
    try {
      instrutor.autoescola_id = sessionStorage.getItem("id_autoescola");

      const { resJSON, res } = await GenericCreate("instrutor", "addinstrutor", instrutor);
      if (res?.ok || res?.status === 200) {
        toast.success(resJSON?.message || "Instrutor cadastrado com sucesso!");
        await buscarInstrutores();
      } else {
        throw new Error(resJSON?.error || "Erro ao cadastrar instrutor");
      }
    } catch (err) {
      toast.error(err.message || "Erro ao cadastrar instrutor.");
    }
  }

  async function editarInstrutor(instrutorEditado, instrutor) {
    instrutorEditado.autoescola_id = sessionStorage.getItem("id_autoescola");
    instrutor.autoescola_id = sessionStorage.getItem("id_autoescola");

    try {
      const [response1, response2] = await Promise.all([
        GenericUpdate("instrutor", "updateinstrutor", instrutorEditado),
        GenericUpdate("adm", "attaluno", instrutor),
      ]);

      if (!response1 || !response2) {
        throw new Error("Erro na atualização dos dados.");
      }

      toast.success(response1.message || "Instrutor atualizado com sucesso!");
      await buscarInstrutores();
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar instrutor.");
    }
  }

  async function mudarAtividadeInstrutor(instrutor_id, ativo) {
    try {
      const res = await GenericPath("instrutor", "updateatividade", `?instrutor_id=${instrutor_id}&ativo=${ativo}`);
      if (!res) throw new Error("Erro ao mudar atividade.");
      toast.success("Atividade alterada com sucesso!");
      await buscarInstrutores();
    } catch (err) {
      toast.error(err.message || "Erro ao mudar atividade do instrutor.");
    }
  }

  const inserirInstrutor = async (instrutor) => {
    const id = sessionStorage.getItem("id_autoescola");
    instrutor.autoescola_id = id;

    try {
      if (!id) throw new Error("Autoescola desconhecida!");

      const { resJSON, res } = await GenericCreate("adm", "addaluno", instrutor);
      if (res?.ok || res?.status === 200) {
        toast.success("Instrutor cadastrado com sucesso!");
        return resJSON;
      } else {
        throw new Error(resJSON?.error || "Erro ao cadastrar instrutor!");
      }
    } catch (error) {
      toast.error(error.message || error.toString());
      return null;
    }
  };

  async function buscarVeiculosInstrutor(instrutor_id, tipo) {
    const autoescola_id = sessionStorage.getItem("id_autoescola");

    try {
      const res = await GenericSearch("adm", "buscarVeiculosPorInstrutor", `?instrutor_id=${instrutor_id}&autoescola_id=${autoescola_id}&tipo=${tipo}`);
      if (!res) throw new Error("Erro ao buscar veículos!");
      return res;
    } catch (error) {
      toast.error(`Erro ao buscar veículos do instrutor: ${error.message || error.toString()}`);
      return null;
    }
  };

  async function inserirExeção(instrutor, data, menor, maior) {
    try {
      if (!instrutor || !data || !menor || !maior) {
        throw new Error("Valores faltando!");
      }

      const execao = {
        instrutor: instrutor,
        data: data,
        menor: menor,
        maior: maior
      }

      const { resJSON, res } = await GenericCreate("adm", "inserirExcecao", execao);
      if (res?.ok || res?.status === 200) {
        toast.success("Bloqueio cadastrado");
      } else {
        throw new Error(resJSON?.error || "Erro ao inserir Bloqueio!");
      }
    } catch (error) {
      toast.error(`Erro ao inserir exceção: ${error}`);
      console.log(error);
    }

  };

  async function buscarExecoesDia(instrutor_id, data) {
    try {
      const res = await GenericSearch("adm", "buscarExecoes", `?instrutor_id=${instrutor_id}&data=${data}`);
      if (!res) throw new Error("Erro ao buscar bloqueios!");
      return res;
    } catch (error) {
      toast.error(`Erro ao buscar bloqueios do instrutor: ${error.message || error.toString()}`);
      return null;
    }
  };

  const deletarExecao = async (id_execao) => {
    try {
      const res = await GenericDelete('adm', id_execao, 'deleteExecao', 'id_execao');

      if (!res) {
        throw new Error("Erro ao excluir Bloqueio");
      }

      toast.success("Bloqueio excluído com sucesso!");
    } catch (erro) {
      toast.error(`Erro ao excluir bloqueio: ${erro.message || erro.toString()}`);
    }
  };


  return {
    instrutores,
    buscarInstrutores,
    cadastrarInstrutor,
    editarInstrutor,
    buscarExecoesDia,
    mudarAtividadeInstrutor,
    buscarVeiculosInstrutor,
    inserirInstrutor,
    inserirExeção,
    deletarExecao,
    loading,
  };
}
