"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import useGeneric from './useGeneric';

export default function useVeiculos() {
  const {
    GenericSearch,
    GenericCreate,
    GenericUpdate,
    GenericPath,
    GenericDeleteRelation,
    loading,
  } = useGeneric();

  const [veiculos, setVeiculos] = useState([]);
  const [instrutoresRelacionados, setInstrutoresRelacionados] = useState([]);

  async function buscarVeiculosTipo(tipo) {
    const id = sessionStorage.getItem("id_autoescola");

    try {
      if (!id) throw new Error("Autoescola não encontrada.");

      const res = await GenericSearch('veiculos', 'buscarTodosPorTipo', `?autoescola_id=${id}&tipo=${tipo}`);
      if (!res) throw new Error("Erro ao buscar veículos.");

      const veiculosFiltrados = res
        .filter(i => i.disponibilidade === true)
        .map(i => ({
          value: i.veiculo_id.toString(),
          label: `${i.placa} - ${i.modelo}`
        }));

      setVeiculos(veiculosFiltrados);
    } catch (err) {
      toast.error(err.message || "Erro ao buscar veículos.");
      setVeiculos([]);
    }
  }

  async function buscarTodosOsVeiculos() {
    const id = sessionStorage.getItem("id_autoescola");

    try {
      if (!id) throw new Error("Autoescola não encontrada.");

      const res = await GenericSearch('veiculos', 'buscarTodos', `?autoescola_id=${id}`);
      if (!res) throw new Error("Erro ao buscar veículos.");

      setVeiculos(res);
    } catch (err) {
      toast.error(err.message || "Erro ao buscar veículos.");
      setVeiculos([]);
    }
  }

  async function criarVeiculo(veiculo) {
    try {
      const autoescola_id = sessionStorage.getItem("id_autoescola");
      if (!autoescola_id) throw new Error("Autoescola não encontrada.");

      veiculo.autoescola_id = autoescola_id;

      const { resJSON, res } = await GenericCreate("veiculos", "addveiculo", veiculo);

      if (!res?.ok) throw new Error(resJSON?.message || "Erro ao cadastrar veículo.");

      toast.success("Veículo cadastrado com sucesso!");
      await buscarTodosOsVeiculos();
    } catch (err) {
      toast.error(err.message || "Erro ao cadastrar veículo.");
    }
  }

  async function editarVeiculo(veiculoEditado) {
    try {
      const response = await GenericUpdate("veiculos", "updateveiculo", veiculoEditado);

      if (!response) throw new Error("Erro na atualização.");

      toast.success("Veículo atualizado com sucesso!");
      await buscarTodosOsVeiculos();
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar veículo.");
    }
  }

  async function atualizarDisponibilidade(id, disponibilidade) {
    try {
      const response = await GenericPath("veiculos", "updatedisponibilidade", `?id=${id}&disponibilidade=${disponibilidade}`);

      if (!response) throw new Error("Erro na atualização de disponibilidade.");

      toast.success("Disponibilidade atualizada!");
      await buscarTodosOsVeiculos();
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar disponibilidade.");
    }
  }

  async function buscarRelacionamentos(veiculo_id) {
    try {
      const res = await GenericSearch("veiculos", "instrutoresPorVeiculo", `?veiculo_id=${veiculo_id}`);
      if (!res) throw new Error("Erro ao buscar relações.");

      setInstrutoresRelacionados(res);
    } catch (err) {
      toast.error(err.message || "Erro ao buscar instrutores.");
      setInstrutoresRelacionados([]);
    }
  }

  async function adicionarRelacionamento(instrutor_id, veiculo_id) {
    try {
      const body = { instrutor_id, veiculo_id };
      const { resJSON, res } = await GenericCreate("veiculos", "relacionarInstrutor", body);

      if (!res?.ok) throw new Error(resJSON?.message || "Erro ao criar relacionamento.");

      toast.success("Relacionamento criado!");
      await buscarRelacionamentos(veiculo_id);
    } catch (err) {
      toast.error(err.message || "Erro ao adicionar relacionamento.");
    }
  }

  async function excluirRelacionamento(instrutor_id, veiculo_id) {
    try {
      const message = await GenericDeleteRelation("veiculos", "relacionarInstrutor", "instrutor_id", "veiculo_id", instrutor_id, veiculo_id);

      if (!message) throw new Error("Erro ao excluir relacionamento.");

      toast.success(typeof message === "string" ? message : "Relacionamento excluído.");
      await buscarRelacionamentos(veiculo_id);
    } catch (err) {
      toast.error(err.message || "Erro ao excluir relacionamento.");
    }
  }

  return {
    veiculos,
    buscarVeiculosTipo,
    buscarTodosOsVeiculos,
    criarVeiculo,
    editarVeiculo,
    atualizarDisponibilidade,
    instrutoresRelacionados,
    buscarRelacionamentos,
    adicionarRelacionamento,
    excluirRelacionamento,
    loading
  };
}
