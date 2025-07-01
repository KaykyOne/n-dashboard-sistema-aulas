"use client"

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
        error
    } = useGeneric();

    const [veiculos, setVeiculos] = useState([]);
    const [instrutoresRelacionados, setInstrutoresRelacionados] = useState([]);

    async function buscarVeiculosTipo(tipo) {
        const id = sessionStorage.getItem("id_autoescola");
        try {
            if (!id) return;
            const res = await GenericSearch('veiculos', 'buscarTodosPorTipo', `?autoescola_id=${id}&tipo=${tipo}`);

            if (error || !res) throw new Error(`Erro ao buscar veículos: ${error}`);

            const veiculosFiltrados = res
                .filter(i => i.disponibilidade == true)
                .map(i => ({
                    value: i.veiculo_id.toString(),
                    label: `${i.placa} - ${i.modelo}`
                }));

            setVeiculos(veiculosFiltrados);
        } catch (err) {
            toast.error(err.message || "Erro ao buscar veículos.");
        }
    }

    async function buscarTodosOsVeiculos() {
        const id = sessionStorage.getItem("id_autoescola");
        try {
            if (!id) return;
            const res = await GenericSearch('veiculos', 'buscarTodos', `?autoescola_id=${id}`);

            if (error || !res) throw new Error(`Erro ao buscar veículos: ${error}`);

            setVeiculos(res);
        } catch (err) {
            toast.error(err.message || "Erro ao buscar veículos.");
        }
    }

    // 2. Criar novo veículo
    async function criarVeiculo(veiculo) {
        try {
            const autoescola_id = sessionStorage.getItem("id_autoescola");
            if (!autoescola_id) throw new Error("Autoescola não encontrada.");

            veiculo.autoescola_id = autoescola_id;

            const { resJSON, res } = await GenericCreate("veiculos", "addveiculo", veiculo);

            if (!res.ok) throw new Error(resJSON.message);

            toast.success("Veículo cadastrado com sucesso!");
        } catch (err) {
            toast.error(err.message || "Erro ao cadastrar veículo.");
        }
    }

    // 3. Editar veículo
    async function editarVeiculo(veiculoEditado) {
        try {
            const response = await GenericUpdate("veiculos", "updateveiculo", veiculoEditado);

            if (!response) throw new Error("Erro na atualização.");

            toast.success("Veículo atualizado com sucesso!");
        } catch (err) {
            toast.error(err.message || "Erro ao atualizar veículo.");
        }
    }

    // 4. Atualizar disponibilidade
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

    // 5. Buscar instrutores vinculados a um veículo
    async function buscarRelacionamentos(veiculo_id) {
        try {
            const res = await GenericSearch("veiculos", "instrutoresPorVeiculo", `?veiculo_id=${veiculo_id}`);
            if (!res) throw new Error("Erro ao buscar relações.");
            setInstrutoresRelacionados(res);
        } catch (err) {
            toast.error(err.message || "Erro ao buscar instrutores.");
        }
    }

    // 6. Adicionar relação instrutor-veículo
    async function adicionarRelacionamento(instrutor_id, veiculo_id) {
        try {
            const body = { instrutor_id, veiculo_id };
            const { resJSON, res } = await GenericCreate("veiculos", "relacionarInstrutor", body);

            if (!res.ok) throw new Error(resJSON.message);
            toast.success("Relacionamento criado!");
            await buscarRelacionamentos(veiculo_id);
        } catch (err) {
            toast.error(err.message || "Erro ao adicionar relacionamento.");
        }
    }

    // 7. Remover relação instrutor-veículo
    async function excluirRelacionamento(instrutor_id, veiculo_id) {
        try {
            const message = await GenericDeleteRelation("veiculos", "relacionarInstrutor", "instrutor_id", "veiculo_id", instrutor_id, veiculo_id);

            toast.success(message || "Relacionamento excluído.");
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
