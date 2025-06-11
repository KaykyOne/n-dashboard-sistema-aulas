"use client"
import { useState, useEffect } from 'react';
import { getToken } from '@/lib/utils';
import useGeneric from './useGeneric';
import { toast } from 'react-toastify';

export default function useInstrutores() {

    const { GenericSearch, loading, error } = useGeneric();
    const [veiculos, setVeiculos] = useState([]);
    let id
    useEffect(() => {
        id = sessionStorage.getItem("id_autoescola");
    })

    async function buscarVeiculosTipo(tipo) {
        if (id === 0) return;
        const res = await GenericSearch('veiculos', 'buscarTodosPorTipo', `?autoescola_id=${id}&tipo=${tipo}`);
        const veiculosFiltrados = res.filter(i => i.disponibilidade == true).map((i) => ({
            value: i.veiculo_id.toString(),
            label: `${i.placa} - ${i.modelo}`,
        }));
        setVeiculos(veiculosFiltrados);
    }

    return { buscarVeiculosTipo, loading, veiculos };
}
