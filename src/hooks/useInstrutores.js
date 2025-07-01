"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import useGeneric from "./useGeneric";

export default function useInstrutores() {
  const {
    GenericSearch,
    GenericCreate,
    GenericUpdate,
    GenericPath, // ou GenericPatch, depende do seu hook, mas vou deixar assim
    loading,
  } = useGeneric();

  const [instrutores, setInstrutores] = useState([]);

  async function buscarInstrutores() {
    const autoescola_id = sessionStorage.getItem("id_autoescola");
    try {
      const res = await GenericSearch("adm", "buscarTodosInstrutores", `?autoescola_id=${autoescola_id}`);
      if (!res) throw new Error("Resposta vazia");
      setInstrutores(res || []);
    } catch (error) {
      toast.error(`Erro ao buscar instrutores: ${error.message || error}`);
    }
  }

  async function cadastrarInstrutor(instrutor) {
    try {
      instrutor.autoescola_id = sessionStorage.getItem("id_autoescola");

      const response = await GenericCreate("instrutor", "addinstrutor", instrutor);
      if (!response) throw new Error(resJSON?.message || "Erro na criação");

      toast.success(response.message);
      await buscarInstrutores();
    } catch (err) {
      toast.error(err.message || "Erro ao cadastrar instrutor.");
    }
  }

  async function editarInstrutor(instrutorEditado) {
    instrutorEditado.autoescola_id = sessionStorage.getItem("id_autoescola");
    try {
      const response = await GenericUpdate("instrutor", "updateinstrutor", instrutorEditado);

      if (!response) throw new Error(resJSON?.message || "Erro na atualização");

      toast.success(response.message);
      await buscarInstrutores();
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar instrutor.");
    }
  }

  async function mudarAtividadeInstrutor(instrutor_id, ativo) {
    try {
      const res = await GenericPath("instrutor", "updateatividade", `?instrutor_id=${instrutor_id}&ativo=${ativo}`);
      if (!res || !res.ok) throw new Error("Erro ao mudar atividade.");
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
      if (res.ok) {
        toast.success("Instrutor cadastrado com sucesso!");
        return resJSON;
      } else {
        toast.error(result?.error || "Erro ao cadastrar Aluno!");
        return resJSON;
      }
    } catch (error) {
      toast.error(error);
    }

  };

  async function buscarVeiculosInstrutor(instrutor_id, tipo) {
    const autoescola_id = sessionStorage.getItem("id_autoescola");
    try {
      const res = await GenericSearch("adm", "buscarVeiculosPorInstrutor", `?instrutor_id=${instrutor_id}&autoescola_id=${autoescola_id}&tipo=${tipo}`);
      if (!res) throw new Error("Erro ao buscar veículos!");
      return res;
    } catch (error) {
      toast.error(`Erro ao buscar veículos do instrutor: ${error.message || error}`);
      return null;
    }
  }

  return {
    instrutores,
    buscarInstrutores,
    cadastrarInstrutor,
    editarInstrutor,
    mudarAtividadeInstrutor,
    buscarVeiculosInstrutor,
    inserirInstrutor,
    loading,
  };
}
